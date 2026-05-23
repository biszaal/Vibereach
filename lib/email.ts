import { Resend } from "resend";
import { waitlistConfirmationHtml } from "./email-templates/waitlist-confirmation";

let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function sendWaitlistConfirmation(
  email: string,
  position: number,
  referralCode: string
): Promise<void> {
  const client = getResend();
  if (!client) return; // silently skip if not configured

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibereach.io";
  const referralUrl = `${base}/waitlist?ref=${referralCode}`;
  const statusUrl = `${base}/waitlist?me=${referralCode}`;

  await client.emails.send({
    from: "VibeReach <waitlist@vibereach.io>",
    to: email,
    subject: `You're #${position} on the VibeReach waitlist`,
    html: waitlistConfirmationHtml({ position, referralUrl, statusUrl }),
  });
}
