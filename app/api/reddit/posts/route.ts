import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateRedditPosts } from "@/lib/claude";
import { getProject } from "@/lib/projects";
import { createDraftPosts, listProjectPosts } from "@/lib/reddit-posts";

export const runtime = "nodejs";
export const maxDuration = 60;

// GET /api/reddit/posts — list posts for current project
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") ?? undefined;

  if (!process.env.AWS_ACCESS_KEY_ID) {
    return NextResponse.json({ posts: [] });
  }

  const cookieStore = await cookies();
  const projectId = cookieStore.get("currentProjectId")?.value;
  if (!projectId) return NextResponse.json({ posts: [] });

  try {
    const posts = await listProjectPosts(
      projectId,
      status as Parameters<typeof listProjectPosts>[1]
    );
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}

// POST /api/reddit/posts — generate drafts for a subreddit
export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "service_unavailable", message: "AI not configured." },
      { status: 503 }
    );
  }

  let body: { subreddit?: string; projectId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const projectId =
    body.projectId ?? cookieStore.get("currentProjectId")?.value;

  if (!projectId) {
    return NextResponse.json(
      { error: "no_project", message: "No project selected." },
      { status: 422 }
    );
  }

  const subreddit = (body.subreddit ?? "").trim().replace(/^r\//, "");
  if (!subreddit) {
    return NextResponse.json(
      { error: "invalid_subreddit", message: "Subreddit name is required." },
      { status: 422 }
    );
  }

  // Fetch the project playbook
  let project;
  try {
    project = await getProject(projectId);
  } catch {
    return NextResponse.json({ error: "project_not_found" }, { status: 404 });
  }

  if (!project?.playbook) {
    return NextResponse.json(
      { error: "no_playbook", message: "Analyse your project first." },
      { status: 422 }
    );
  }

  const subInfo = project.playbook.subreddits?.find(
    (s) => s.name.toLowerCase() === subreddit.toLowerCase()
  );
  const angle = subInfo?.angle ?? `genuine contribution to r/${subreddit}`;
  const fitScore = subInfo?.fitScore ?? 50;

  // Generate with Claude
  let posts;
  try {
    posts = await generateRedditPosts(project.playbook, subreddit, angle);
  } catch (err) {
    console.error("[reddit/posts] generation error", err);
    return NextResponse.json(
      { error: "generation_failed", message: "Post generation failed. Try again." },
      { status: 500 }
    );
  }

  // Persist to DynamoDB if available
  let records = posts.map((p) => ({ ...p, fitScore, postId: crypto.randomUUID() }));
  if (process.env.AWS_ACCESS_KEY_ID) {
    try {
      const saved = await createDraftPosts(projectId, subreddit, fitScore, posts);
      records = saved.map((r) => ({ ...r }));
    } catch (err) {
      console.error("[reddit/posts] db write error", err);
    }
  }

  return NextResponse.json({ posts: records });
}
