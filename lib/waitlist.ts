import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { db, WAITLIST_TABLE } from "./dynamodb";
import crypto from "crypto";

const COUNTER_PK = "__COUNTER__";
const COUNTER_SK = "WAITLIST";

function generateReferralCode(): string {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function getWaitlistCount(): Promise<number> {
  const res = await db.send(
    new GetCommand({
      TableName: WAITLIST_TABLE,
      Key: { pk: COUNTER_PK, sk: COUNTER_SK },
    })
  );
  return (res.Item?.count as number) ?? 0;
}

async function atomicIncrementPosition(): Promise<number> {
  const res = await db.send(
    new UpdateCommand({
      TableName: WAITLIST_TABLE,
      Key: { pk: COUNTER_PK, sk: COUNTER_SK },
      UpdateExpression: "ADD #count :one",
      ExpressionAttributeNames: { "#count": "count" },
      ExpressionAttributeValues: { ":one": 1 },
      ReturnValues: "UPDATED_NEW",
    })
  );
  return res.Attributes!.count as number;
}

export async function getReferrerEmailByCode(
  code: string
): Promise<string | null> {
  const res = await db.send(
    new QueryCommand({
      TableName: WAITLIST_TABLE,
      IndexName: "referralCode-index",
      KeyConditionExpression: "referralCode = :code",
      ExpressionAttributeValues: { ":code": code },
      Limit: 1,
    })
  );
  if (!res.Items?.length) return null;
  const pk: string = res.Items[0].pk;
  return pk.replace("USER#", "");
}

export type JoinResult =
  | { ok: true; position: number; referralCode: string; alreadyJoined: false }
  | { ok: true; position: number; referralCode: string; alreadyJoined: true }
  | { ok: false; error: "invalid_email" | "service_unavailable" };

export async function joinWaitlist(
  rawEmail: string,
  referralCode?: string
): Promise<JoinResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!isValidEmail(email)) return { ok: false, error: "invalid_email" };

  const pk = `USER#${email}`;
  const sk = "PROFILE";

  // Check existing
  const existing = await db.send(
    new GetCommand({ TableName: WAITLIST_TABLE, Key: { pk, sk } })
  );
  if (existing.Item) {
    return {
      ok: true,
      alreadyJoined: true,
      position: existing.Item.position as number,
      referralCode: existing.Item.referralCode as string,
    };
  }

  // Resolve referrer
  let referredBy: string | undefined;
  if (referralCode) {
    const referrerEmail = await getReferrerEmailByCode(referralCode);
    if (referrerEmail && referrerEmail !== email) {
      referredBy = referrerEmail;
    }
  }

  const position = await atomicIncrementPosition();
  const newCode = generateReferralCode();
  const now = new Date().toISOString();

  try {
    await db.send(
      new PutCommand({
        TableName: WAITLIST_TABLE,
        Item: {
          pk,
          sk,
          email,
          position,
          referralCode: newCode,
          referredBy,
          referralCount: 0,
          createdAt: now,
        },
        ConditionExpression: "attribute_not_exists(pk)",
      })
    );
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) {
      // Race condition — they joined between check and put; re-fetch
      const refetch = await db.send(
        new GetCommand({ TableName: WAITLIST_TABLE, Key: { pk, sk } })
      );
      return {
        ok: true,
        alreadyJoined: true,
        position: refetch.Item!.position as number,
        referralCode: refetch.Item!.referralCode as string,
      };
    }
    throw err;
  }

  // Credit the referrer
  if (referredBy) {
    await db.send(
      new UpdateCommand({
        TableName: WAITLIST_TABLE,
        Key: { pk: `USER#${referredBy}`, sk: "PROFILE" },
        UpdateExpression: "ADD referralCount :one",
        ExpressionAttributeValues: { ":one": 1 },
      })
    );
  }

  return { ok: true, alreadyJoined: false, position, referralCode: newCode };
}
