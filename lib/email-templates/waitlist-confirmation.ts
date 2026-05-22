interface Props {
  position: number;
  referralUrl: string;
}

export function waitlistConfirmationHtml({ position, referralUrl }: Props): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>You're on the VibeReach waitlist</title>
</head>
<body style="margin:0;padding:0;background:#EFE7D6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFE7D6;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <!-- Logo -->
        <tr><td style="padding-bottom:40px;">
          <span style="font-family:Georgia,serif;font-size:15px;font-weight:bold;color:#17120C;letter-spacing:-0.02em;">
            VibeReach
          </span>
        </td></tr>

        <!-- Position -->
        <tr><td style="border:1px solid rgba(23,18,12,0.14);background:#F4EEE0;padding:40px;box-shadow:4px 4px 0 #17120C;">
          <p style="margin:0 0 8px;font-family:Courier New,monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#8A8071;">
            Queue position
          </p>
          <p style="margin:0 0 4px;font-size:72px;font-weight:800;line-height:1;letter-spacing:-0.03em;color:#17120C;font-family:Georgia,serif;">
            #${position}
          </p>
          <p style="margin:0;font-size:14px;color:#5C5346;">
            You're on the list.
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 0 0;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#17120C;">
            Thanks for joining the VibeReach waitlist. We're building a marketing
            autopilot for indie developers — the kind of tool we wish existed when
            our own projects launched to silence.
          </p>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5C5346;">
            Refer 3 friends and skip the queue. Your personal link:
          </p>

          <!-- Referral link box -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#17120C;padding:14px 18px;border:1px solid #17120C;">
                <p style="margin:0;font-family:Courier New,monospace;font-size:12px;color:#EFE7D6;word-break:break-all;">
                  ${referralUrl}
                </p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- What's coming -->
        <tr><td style="padding:32px 0 0;">
          <p style="margin:0 0 12px;font-family:Courier New,monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#8A8071;">
            What we're building
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(23,18,12,0.14);background:#F4EEE0;">
            ${[
              ["Project Analyser", "Scrapes your product and generates a full marketing playbook"],
              ["Reddit Engine", "Native-feeling posts, one per subreddit, with your approval"],
              ["SEO Audit", "Weekly score + prioritised fixes for your landing page"],
              ["Cold Email", "Warm outreach that sounds like it came from a person"],
            ]
              .map(
                ([title, desc], i) => `
            <tr style="${i > 0 ? "border-top:1px solid rgba(23,18,12,0.10);" : ""}">
              <td style="padding:12px 16px;">
                <p style="margin:0 0 2px;font-size:13px;font-weight:bold;color:#17120C;">${title}</p>
                <p style="margin:0;font-size:12px;color:#5C5346;">${desc}</p>
              </td>
            </tr>`
              )
              .join("")}
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:40px 0 0;">
          <p style="margin:0;font-size:12px;color:#8A8071;line-height:1.6;">
            You're receiving this because you joined the VibeReach waitlist.<br/>
            No unsubscribe needed — we'll only email you about the launch.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
