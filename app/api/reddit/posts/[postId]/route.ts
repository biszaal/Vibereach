import { NextRequest, NextResponse } from "next/server";
import { approvePost, updatePostBody } from "@/lib/reddit-posts";
import { enqueuePost } from "@/lib/queue";

export const runtime = "nodejs";

// PATCH /api/reddit/posts/[postId] — approve or edit a draft
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  let body: {
    action?: "approve" | "edit";
    title?: string;
    text?: string;
    subreddit?: string;
    projectId?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (body.action === "approve") {
    // Schedule 24–72 hours out with ±2 h jitter for spam-safety
    const baseDelay = 24 + Math.floor(Math.random() * 48); // hours
    const jitterMs = (Math.random() - 0.5) * 2 * 60 * 60 * 1000;
    const scheduledAt = new Date(
      Date.now() + baseDelay * 60 * 60 * 1000 + jitterMs
    ).toISOString();

    if (process.env.AWS_ACCESS_KEY_ID) {
      await approvePost(postId, scheduledAt);
    }

    if (body.subreddit && body.projectId) {
      await enqueuePost({
        postId,
        projectId: body.projectId,
        subreddit: body.subreddit,
        scheduledAt,
      });
    }

    return NextResponse.json({ status: "scheduled", scheduledAt });
  }

  if (body.action === "edit") {
    if (!body.title && !body.text) {
      return NextResponse.json({ error: "nothing_to_update" }, { status: 422 });
    }

    if (process.env.AWS_ACCESS_KEY_ID) {
      await updatePostBody(postId, body.title ?? "", body.text ?? "");
    }

    return NextResponse.json({ status: "updated" });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 422 });
}
