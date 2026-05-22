"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { StatBig } from "@/components/ui/StatBig";
import { StatCard } from "@/components/ui/StatCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Ticker } from "@/components/ui/Ticker";
import { Tag } from "@/components/ui/Tag";
import { ReachChart } from "@/components/ui/ReachChart";

interface DashStats {
  totalReach: number;
  postsPublished: number;
  draftsAwaiting: number;
  signupsAttributed: number;
  auditScore: number | null;
  auditDate: string | null;
  activityFeed: Array<{ time: string; text: string; type: string }>;
}

const TICKER_ITEMS = [
  "Connect a project to get started",
  "Analyse your URL → get a playbook",
  "Generate Reddit posts → approve → schedule",
  "Run an SEO audit → get fixes",
  "VibeReach — marketing autopilot for indie devs",
];

const CONSULTANT_FEED = [
  { tag: "fix" as const, title: "Add social proof above the fold", why: "No testimonials or user count visible before scroll. Pages with social proof convert 34% better on average." },
  { tag: "fix" as const, title: "Meta description is missing", why: "Google is generating one automatically. Write one under 160 chars with your core value prop." },
  { tag: "add" as const, title: "Add an FAQ section", why: "Common objections go unanswered. An FAQ reduces bounce and improves time-on-page." },
  { tag: "good" as const, title: "Page load time is fast", why: "Core Web Vitals are in the green. Keep image optimisation in place." },
];

const TYPE_ICON: Record<string, string> = { post: "▣", signup: "◈", audit: "◎", playbook: "◉", draft: "▣", email: "◇" };
const TYPE_COLOR: Record<string, string> = { post: "#3E8E4F", signup: "#3E8E4F", audit: "#F23005", playbook: "#17120C", draft: "#8A8071", email: "#5C5346" };

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return "just now";
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Yesterday" : `${d} days ago`;
}

export default function DashboardPage() {
  const [stats,   setStats]   = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProject, setHasProject] = useState(false);

  useEffect(() => {
    const pid = document.cookie.match(/currentProjectId=([^;]+)/)?.[1];
    setHasProject(!!pid);

    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(({ stats: s }) => { if (s) setStats(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const reach   = stats?.totalReach        ?? 0;
  const audScore = stats?.auditScore       ?? null;
  const ticker  = stats && reach > 0
    ? [`Total reach: ${reach.toLocaleString()}`, `${stats.postsPublished} posts live`, `${stats.signupsAttributed} signups tracked`, ...TICKER_ITEMS]
    : TICKER_ITEMS;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar
        breadcrumb={["Dashboard"]}
        title="Overview"
        actions={
          <a href="/onboarding"
            className="text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-sm border shadow-hard-sm whitespace-nowrap"
            style={{ fontFamily: "var(--font-jetbrains), monospace", background: "#17120C", color: "#EFE7D6", borderColor: "#17120C" }}>
            + New project
          </a>
        }
      />

      <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Ticker items={ticker} />

        {/* No project CTA */}
        {!hasProject && !loading && (
          <div className="border rounded-sm px-5 py-8 text-center"
            style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}>
            <p className="text-[0.68rem] uppercase tracking-[0.12em] mb-3"
              style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
              No project yet
            </p>
            <p className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
              Paste a URL. Get a playbook.
            </p>
            <p className="text-sm mb-6" style={{ color: "#5C5346" }}>
              VibeReach analyses your landing page and builds a full marketing strategy in under 30 seconds.
            </p>
            <a href="/onboarding"
              className="inline-block text-sm font-semibold px-6 py-3 border shadow-hard"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", background: "#17120C", color: "#EFE7D6", borderColor: "#17120C" }}>
              Analyse my project →
            </a>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            {loading ? (
              <div className="h-44 rounded-sm animate-pulse" style={{ background: "#17120C", opacity: 0.3 }} />
            ) : (
              <StatBig
                value={reach > 0 ? reach.toLocaleString() : "—"}
                label="Total Reach"
                sub={reach > 0 ? "estimated impressions this month" : "analyse a project to start tracking"}
                delta={reach > 0 ? `${stats?.postsPublished ?? 0} posts live` : undefined}
                deltaPositive
              />
            )}
          </div>
          <StatCard
            value={loading ? "—" : String(stats?.postsPublished ?? 0)}
            label="Posts Published"
            sub="across all subreddits"
          />
          <StatCard
            value={loading ? "—" : audScore !== null ? String(audScore) : "—"}
            label="SEO Score"
            sub={stats?.auditDate ? `last audit ${timeAgo(stats.auditDate)}` : "no audit yet"}
            accent={audScore !== null && audScore < 70}
          />
        </div>

        {/* Second stat row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            value={loading ? "—" : String(stats?.draftsAwaiting ?? 0)}
            label="Drafts Awaiting"
            sub="approval or scheduled"
          />
          <StatCard
            value={loading ? "—" : String(stats?.signupsAttributed ?? 0)}
            label="Signups Attributed"
            sub="tracked via Reddit posts"
            delta={stats?.signupsAttributed ? "+tracking active" : undefined}
            deltaPositive
          />
          <StatCard
            value="Free"
            label="Current Plan"
            sub="10 posts · 1 audit / month"
            accent
          />
        </div>

        {/* Chart + activity */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 border rounded-sm p-4 sm:p-5"
            style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}>
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>Reach over time</SectionLabel>
              <span className="text-[0.62rem] uppercase tracking-[0.08em]"
                style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
                Last 30 days
              </span>
            </div>
            <ReachChart />
          </div>

          <div className="lg:col-span-2 border rounded-sm p-4 sm:p-5"
            style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}>
            <SectionLabel className="mb-4">Activity</SectionLabel>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="h-8 rounded-sm animate-pulse" style={{ background: "rgba(23,18,12,0.06)" }} />
                ))}
              </div>
            ) : stats?.activityFeed?.length ? (
              <ul className="space-y-3.5">
                {stats.activityFeed.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 text-[0.75rem] w-4 text-center"
                      style={{ fontFamily: "var(--font-jetbrains), monospace", color: TYPE_COLOR[item.type] ?? "#8A8071" }}>
                      {TYPE_ICON[item.type] ?? "◇"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs leading-snug" style={{ color: "#17120C" }}>{item.text}</p>
                      <p className="text-[0.62rem] mt-0.5 uppercase tracking-[0.06em]"
                        style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
                        {timeAgo(item.time)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs" style={{ color: "#8A8071" }}>No activity yet. Generate and approve some posts to get started.</p>
            )}
          </div>
        </div>

        {/* Consultant feed */}
        <div>
          <SectionLabel className="mb-4">What to do next</SectionLabel>
          <div className="space-y-2.5">
            {CONSULTANT_FEED.map((item, i) => (
              <div key={i}
                className="flex items-start gap-3 sm:gap-4 border rounded-sm px-4 sm:px-5 py-4"
                style={{
                  background: "#F4EEE0",
                  borderColor: item.tag === "fix" ? "rgba(242,48,5,0.20)" : item.tag === "good" ? "rgba(62,142,79,0.20)" : "rgba(23,18,12,0.14)",
                  borderLeft: item.tag === "fix" ? "3px solid #F23005" : item.tag === "good" ? "3px solid #3E8E4F" : "3px solid rgba(23,18,12,0.20)",
                }}>
                <Tag variant={item.tag} className="mt-0.5 shrink-0">
                  {item.tag === "good" ? "Good" : item.tag === "fix" ? "Fix" : "Add"}
                </Tag>
                <div className="min-w-0">
                  <p className="text-sm font-semibold mb-1"
                    style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#5C5346" }}>{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
