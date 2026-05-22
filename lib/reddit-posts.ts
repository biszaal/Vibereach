import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import { db } from "./dynamodb";

export const REDDIT_TABLE =
  process.env.REDDIT_TABLE_NAME ?? "vibereach-reddit-posts";

export type PostStatus = "draft" | "scheduled" | "posted" | "failed";
export type PostVariant = "founder-story" | "question-led" | "value-first";

export interface RedditPostRecord {
  postId: string;
  projectId: string;
  subreddit: string;
  title: string;
  body: string;
  variant: PostVariant;
  fitScore: number;
  status: PostStatus;
  scheduledAt?: string;
  postedAt?: string;
  redditPostId?: string;
  metrics?: { upvotes: number; comments: number; signups: number };
  createdAt: string;
  updatedAt: string;
}

const SK = "PROFILE";
const pk = (postId: string) => `POST#${postId}`;

export async function createDraftPosts(
  projectId: string,
  subreddit: string,
  fitScore: number,
  posts: Array<{ variant: PostVariant; title: string; body: string }>
): Promise<RedditPostRecord[]> {
  const now = new Date().toISOString();
  const records: RedditPostRecord[] = posts.map((p) => ({
    postId: crypto.randomBytes(8).toString("hex"),
    projectId,
    subreddit,
    title: p.title,
    body: p.body,
    variant: p.variant,
    fitScore,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  }));

  await Promise.all(
    records.map((r) =>
      db.send(
        new PutCommand({
          TableName: REDDIT_TABLE,
          Item: { pk: pk(r.postId), sk: SK, ...r },
        })
      )
    )
  );

  return records;
}

export async function getPost(postId: string): Promise<RedditPostRecord | null> {
  const res = await db.send(
    new GetCommand({ TableName: REDDIT_TABLE, Key: { pk: pk(postId), sk: SK } })
  );
  if (!res.Item) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pk: _pk, sk: _sk, ...rest } = res.Item;
  return rest as RedditPostRecord;
}

export async function listProjectPosts(
  projectId: string,
  status?: PostStatus
): Promise<RedditPostRecord[]> {
  const res = await db.send(
    new QueryCommand({
      TableName: REDDIT_TABLE,
      IndexName: "projectId-index",
      KeyConditionExpression: "projectId = :pid",
      FilterExpression: status ? "#s = :status" : undefined,
      ExpressionAttributeNames: status ? { "#s": "status" } : undefined,
      ExpressionAttributeValues: {
        ":pid": projectId,
        ...(status ? { ":status": status } : {}),
      },
    })
  );
  return (res.Items ?? []).map(({ pk: _pk, sk: _sk, ...rest }) => rest as RedditPostRecord);
}

export async function approvePost(postId: string, scheduledAt: string): Promise<void> {
  await db.send(
    new UpdateCommand({
      TableName: REDDIT_TABLE,
      Key: { pk: pk(postId), sk: SK },
      UpdateExpression: "SET #s = :s, scheduledAt = :sa, updatedAt = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":s": "scheduled",
        ":sa": scheduledAt,
        ":now": new Date().toISOString(),
      },
    })
  );
}

export async function updatePostBody(
  postId: string,
  title: string,
  body: string
): Promise<void> {
  await db.send(
    new UpdateCommand({
      TableName: REDDIT_TABLE,
      Key: { pk: pk(postId), sk: SK },
      UpdateExpression: "SET title = :t, body = :b, updatedAt = :now",
      ExpressionAttributeValues: {
        ":t": title,
        ":b": body,
        ":now": new Date().toISOString(),
      },
    })
  );
}
