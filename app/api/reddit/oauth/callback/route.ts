import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const runtime = "nodejs";

const ACCOUNTS_TABLE = process.env.ACCOUNTS_TABLE_NAME ?? "vibereach-accounts";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code  = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/settings?reddit=denied`);
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("reddit_oauth_state")?.value;
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${appUrl}/settings?reddit=error`);
  }

  const clientId     = process.env.REDDIT_CLIENT_ID!;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET!;
  const redirectUri  = `${appUrl}/api/reddit/oauth/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "VibeReach/1.0 by u/vibereach",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${appUrl}/settings?reddit=error`);
  }

  const tokenData: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  } = await tokenRes.json();

  // Fetch Reddit username
  const meRes = await fetch("https://oauth.reddit.com/api/v1/me", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "VibeReach/1.0 by u/vibereach",
    },
  });
  const me: { name: string } = await meRes.json();

  // Store in DynamoDB
  if (process.env.AWS_ACCESS_KEY_ID) {
    await db.send(
      new PutCommand({
        TableName: ACCOUNTS_TABLE,
        Item: {
          pk: "ACCOUNT#anonymous#reddit",
          sk: "PROFILE",
          platform: "reddit",
          userId: "anonymous",
          username: me.name,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          connectedAt: new Date().toISOString(),
        },
      })
    );
  }

  cookieStore.set("reddit_username", me.name, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false,
    sameSite: "lax",
  });

  return NextResponse.redirect(`${appUrl}/settings?reddit=connected`);
}
