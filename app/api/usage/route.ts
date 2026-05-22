import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

// Tier limits (Free plan)
const LIMITS = {
  free: {
    postsPerMonth: 10,
    auditsPerMonth: 1,
    projects: 1,
  },
  starter: {
    postsPerMonth: 50,
    auditsPerMonth: 4,
    projects: 3,
  },
  pro: {
    postsPerMonth: Infinity,
    auditsPerMonth: Infinity,
    projects: Infinity,
  },
};

export async function GET() {
  const plan = "free"; // Replace with real plan lookup once auth is wired
  const limits = LIMITS[plan];

  if (!process.env.AWS_ACCESS_KEY_ID) {
    return NextResponse.json({ plan, limits, usage: { posts: 0, audits: 0, projects: 1 } });
  }

  const cookieStore = await cookies();
  const projectId   = cookieStore.get("currentProjectId")?.value;

  try {
    const { listProjectPosts } = await import("@/lib/reddit-posts");

    const posts = projectId ? await listProjectPosts(projectId) : [];
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const postsThisMonth = posts.filter(
      (p) => p.status !== "draft" && new Date(p.createdAt) >= thisMonth
    ).length;

    return NextResponse.json({
      plan,
      limits: {
        ...limits,
        postsPerMonth: limits.postsPerMonth === Infinity ? null : limits.postsPerMonth,
        auditsPerMonth: limits.auditsPerMonth === Infinity ? null : limits.auditsPerMonth,
        projects: limits.projects === Infinity ? null : limits.projects,
      },
      usage: {
        posts: postsThisMonth,
        audits: 1,
        projects: projectId ? 1 : 0,
      },
    });
  } catch {
    return NextResponse.json({ plan, limits, usage: { posts: 0, audits: 0, projects: 0 } });
  }
}
