import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  if (!process.env.AWS_ACCESS_KEY_ID) {
    return NextResponse.json({ stats: null });
  }

  const cookieStore = await cookies();
  const projectId   = cookieStore.get("currentProjectId")?.value;
  if (!projectId) return NextResponse.json({ stats: null });

  try {
    const [
      { listProjectPosts },
      { getLatestAuditReport },
    ] = await Promise.all([
      import("@/lib/reddit-posts"),
      import("@/lib/audit-reports"),
    ]);

    const [allPosts, latestAudit] = await Promise.all([
      listProjectPosts(projectId),
      getLatestAuditReport(projectId),
    ]);

    const drafts    = allPosts.filter((p) => p.status === "draft").length;
    const scheduled = allPosts.filter((p) => p.status === "scheduled").length;
    const posted    = allPosts.filter((p) => p.status === "posted");

    const totalUpvotes = posted.reduce((sum, p) => sum + (p.metrics?.upvotes ?? 0), 0);
    const totalSignups = posted.reduce((sum, p) => sum + (p.metrics?.signups ?? 0), 0);
    const totalReach   = totalUpvotes * 8 + totalSignups * 20; // rough estimate

    // Recent activity feed from posts
    const recentPosts = [...allPosts]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8)
      .map((p) => ({
        time: p.updatedAt,
        text:
          p.status === "posted"
            ? `Posted to r/${p.subreddit} — ${p.metrics?.upvotes ?? 0} upvotes`
            : p.status === "scheduled"
            ? `Scheduled for r/${p.subreddit}`
            : `Draft ready for r/${p.subreddit}`,
        type: p.status === "posted" ? "post" : p.status === "scheduled" ? "draft" : "draft",
      }));

    if (latestAudit) {
      recentPosts.unshift({
        time: latestAudit.createdAt,
        text: `SEO audit completed — score ${latestAudit.score}/100`,
        type: "audit",
      });
    }

    return NextResponse.json({
      stats: {
        totalReach,
        postsPublished: posted.length,
        draftsAwaiting: drafts + scheduled,
        signupsAttributed: totalSignups,
        auditScore: latestAudit?.score ?? null,
        auditDate: latestAudit?.createdAt ?? null,
        activityFeed: recentPosts.slice(0, 6),
      },
    });
  } catch (err) {
    console.error("[dashboard] stats error", err);
    return NextResponse.json({ stats: null });
  }
}
