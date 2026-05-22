import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Reddit OAuth not configured." }, { status: 503 });
  }

  const state = crypto.randomBytes(16).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set("reddit_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    state,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/reddit/oauth/callback`,
    duration: "permanent",
    scope: "submit,read,identity",
  });

  return NextResponse.redirect(
    `https://www.reddit.com/api/v1/authorize?${params.toString()}`
  );
}
