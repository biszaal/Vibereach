import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { scrapeUrl } from "@/lib/scraper";
import { generateAudit } from "@/lib/ai";
import { getProject } from "@/lib/projects";
import { saveAuditReport, getLatestAuditReport } from "@/lib/audit-reports";
import { Resend } from "resend";
import { auditReportHtml } from "@/lib/email-templates/audit-report";

export const runtime = "nodejs";
export const maxDuration = 60;

// GET /api/audit — fetch latest report for current project
export async function GET() {
  if (!process.env.AWS_ACCESS_KEY_ID) return NextResponse.json({ report: null });

  const cookieStore = await cookies();
  const projectId   = cookieStore.get("currentProjectId")?.value;
  if (!projectId)   return NextResponse.json({ report: null });

  try {
    const record = await getLatestAuditReport(projectId);
    return NextResponse.json({ report: record ?? null });
  } catch {
    return NextResponse.json({ report: null });
  }
}

// POST /api/audit — run a fresh audit
export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "service_unavailable", message: "AI not configured." },
      { status: 503 }
    );
  }

  let body: { projectId?: string; url?: string; email?: string };
  try { body = await req.json(); } catch { body = {}; }

  const cookieStore = await cookies();
  const projectId   = body.projectId ?? cookieStore.get("currentProjectId")?.value;

  // Resolve URL from project or direct param
  let url = body.url?.trim();
  if (!url && projectId && process.env.AWS_ACCESS_KEY_ID) {
    const project = await getProject(projectId).catch(() => null);
    url = project?.url;
  }

  if (!url) {
    return NextResponse.json(
      { error: "no_url", message: "No project URL found. Analyse a project first." },
      { status: 422 }
    );
  }

  // Scrape + audit
  let scraped, report;
  try {
    const start = Date.now();
    scraped = await scrapeUrl(url);
    (scraped as typeof scraped & { loadTimeMs?: number }).loadTimeMs = Date.now() - start;
    report  = await generateAudit(scraped as typeof scraped & { loadTimeMs?: number });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[audit] failed", msg);
    if (msg.includes("HTTP 4") || msg.includes("fetch") || msg.includes("abort")) {
      return NextResponse.json(
        { error: "fetch_failed", message: "Couldn't reach that URL." },
        { status: 422 }
      );
    }
    return NextResponse.json({ error: "audit_failed", message: "Audit failed. Try again." }, { status: 500 });
  }

  // Persist
  let record;
  if (projectId && process.env.AWS_ACCESS_KEY_ID) {
    record = await saveAuditReport(projectId, url, report).catch(() => null);
  }

  // Send email report if address provided
  const toEmail = body.email;
  if (toEmail && process.env.RESEND_API_KEY) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    new Resend(process.env.RESEND_API_KEY).emails
      .send({
        from: "VibeReach <reports@vibereach.io>",
        to: toEmail,
        subject: `SEO audit — ${url} — score ${report.score}/100`,
        html: auditReportHtml({ url, report, appUrl }),
      })
      .catch((e) => console.error("[audit] email error", e));
  }

  return NextResponse.json({ report, reportId: record?.reportId });
}
