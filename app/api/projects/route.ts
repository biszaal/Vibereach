import { NextRequest, NextResponse } from "next/server";
import { scrapeUrl } from "@/lib/scraper";
import { generatePlaybook } from "@/lib/ai";
import {
  createProject,
  updateProjectPlaybook,
  updateProjectFailed,
} from "@/lib/projects";

export const runtime = "nodejs";
export const maxDuration = 60;

function isValidUrl(raw: string): boolean {
  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function normaliseUrl(raw: string): string {
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "service_unavailable", message: "AI analysis not configured yet." },
      { status: 503 }
    );
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const rawUrl = (body.url ?? "").trim();
  if (!rawUrl || !isValidUrl(rawUrl)) {
    return NextResponse.json(
      { error: "invalid_url", message: "Enter a valid URL (e.g. https://myapp.com)." },
      { status: 422 }
    );
  }

  const url = normaliseUrl(rawUrl);

  // Create the project record immediately so we have an ID
  let project;
  if (process.env.AWS_ACCESS_KEY_ID) {
    project = await createProject(url, url, "anonymous");
  } else {
    // No DB — still run the analysis, just don't persist
    project = {
      projectId: crypto.randomUUID(),
      url,
      name: url,
      status: "analyzing" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "anonymous",
    };
  }

  // Scrape + analyse synchronously (typically 8-15 s)
  try {
    const scraped = await scrapeUrl(url);
    const playbook = await generatePlaybook(scraped);

    const name = playbook.summary.slice(0, 60) || scraped.title || url;

    if (process.env.AWS_ACCESS_KEY_ID) {
      await updateProjectPlaybook(project.projectId, playbook, name);
    }

    const response = NextResponse.json({
      projectId: project.projectId,
      name,
      playbook,
    });

    // Set current project cookie (30 days, readable by client for sidebar)
    response.cookies.set("currentProjectId", project.projectId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[projects] analysis failed", msg);

    if (process.env.AWS_ACCESS_KEY_ID) {
      await updateProjectFailed(project.projectId, msg).catch(() => {});
    }

    if (msg.includes("HTTP 4") || msg.includes("fetch") || msg.includes("abort")) {
      return NextResponse.json(
        { error: "fetch_failed", message: `Couldn't reach that URL. Check it's publicly accessible.` },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "analysis_failed", message: "Analysis failed. Try again." },
      { status: 500 }
    );
  }
}
