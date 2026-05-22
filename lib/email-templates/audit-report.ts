import type { AuditReport } from "@/lib/claude";

interface Props {
  url: string;
  report: AuditReport;
  appUrl: string;
}

export function auditReportHtml({ url, report, appUrl }: Props): string {
  const scoreColor = report.score >= 75 ? "#3E8E4F" : report.score >= 50 ? "#F23005" : "#C92704";

  const itemRows = (items: { title: string; why: string }[], accent: string) =>
    items
      .map(
        (item) => `
      <tr>
        <td style="padding:10px 16px;border-top:1px solid rgba(23,18,12,0.10);">
          <p style="margin:0 0 3px;font-size:13px;font-weight:600;color:#17120C;">${item.title}</p>
          <p style="margin:0;font-size:12px;color:#5C5346;line-height:1.5;">${item.why}</p>
        </td>
      </tr>`
      )
      .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#EFE7D6;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFE7D6;padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

  <!-- Logo -->
  <tr><td style="padding-bottom:32px;">
    <span style="font-size:14px;font-weight:bold;color:#17120C;letter-spacing:-0.02em;">VibeReach</span>
  </td></tr>

  <!-- Score card -->
  <tr><td style="background:#17120C;padding:32px 32px 24px;box-shadow:4px 4px 0 rgba(23,18,12,0.2);">
    <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#5C5346;">
      Weekly SEO audit — ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
    </p>
    <p style="margin:0 0 4px;font-size:10px;font-family:'Courier New',monospace;color:#5C5346;">${url}</p>
    <p style="margin:16px 0 4px;font-size:64px;font-weight:800;line-height:1;letter-spacing:-0.04em;color:${scoreColor};">
      ${report.score}
    </p>
    <p style="margin:0;font-size:13px;color:#8A8071;">/ 100</p>
  </td></tr>

  <!-- Headline rewrite -->
  <tr><td style="padding:28px 0 0;">
    <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#8A8071;">
      Suggested headline
    </p>
    <p style="margin:0;font-size:20px;font-weight:700;color:#17120C;line-height:1.2;letter-spacing:-0.02em;">
      ${report.headlineRewrite}
    </p>
  </td></tr>

  <!-- Meta rewrite -->
  <tr><td style="padding:16px 0 0;">
    <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#8A8071;">
      Suggested meta description
    </p>
    <p style="margin:0;font-size:13px;color:#5C5346;line-height:1.5;">${report.metaRewrite}</p>
  </td></tr>

  <!-- Critical fixes -->
  ${report.critical.length > 0 ? `
  <tr><td style="padding:28px 0 0;">
    <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#F23005;">
      Fix this week (${report.critical.length})
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(242,48,5,0.20);background:#F4EEE0;border-left:3px solid #F23005;">
      ${itemRows(report.critical, "#F23005")}
    </table>
  </td></tr>` : ""}

  <!-- Recommended -->
  ${report.recommended.length > 0 ? `
  <tr><td style="padding:20px 0 0;">
    <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#8A8071;">
      Recommended (${report.recommended.length})
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(23,18,12,0.14);background:#F4EEE0;">
      ${itemRows(report.recommended, "#8A8071")}
    </table>
  </td></tr>` : ""}

  <!-- CTA -->
  <tr><td style="padding:28px 0 0;">
    <a href="${appUrl}/audit" style="display:inline-block;background:#17120C;color:#EFE7D6;font-size:12px;font-family:'Courier New',monospace;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:12px 20px;border:1px solid #17120C;">
      View full audit →
    </a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:36px 0 0;">
    <p style="margin:0;font-size:11px;color:#8A8071;line-height:1.6;">
      VibeReach sends this weekly report automatically.<br/>
      To stop receiving it, visit your settings.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
