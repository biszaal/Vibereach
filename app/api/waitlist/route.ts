import { NextRequest, NextResponse } from "next/server";
import { joinWaitlist } from "@/lib/waitlist";
import { sendWaitlistConfirmation } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.AWS_ACCESS_KEY_ID) {
    return NextResponse.json(
      { error: "service_unavailable", message: "Waitlist not yet open." },
      { status: 503 }
    );
  }

  let body: { email?: string; referralCode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const { email, referralCode } = body;
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "invalid_email" }, { status: 422 });
  }

  let result;
  try {
    result = await joinWaitlist(email, referralCode);
  } catch (err) {
    console.error("[waitlist] join error", err);
    return NextResponse.json(
      { error: "internal", message: "Something went wrong." },
      { status: 500 }
    );
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  if (!result.alreadyJoined) {
    sendWaitlistConfirmation(
      email,
      result.position,
      result.referralCode
    ).catch((err) => console.error("[waitlist] email error", err));
  }

  return NextResponse.json({
    position: result.position,
    referralCode: result.referralCode,
    alreadyJoined: result.alreadyJoined,
  });
}
