import { NextResponse } from "next/server";
import { getWaitlistCount } from "@/lib/waitlist";

export const runtime = "nodejs";
export const revalidate = 60; // cache for 60s

export async function GET() {
  if (!process.env.AWS_ACCESS_KEY_ID) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const count = await getWaitlistCount();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
