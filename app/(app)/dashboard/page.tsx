import { TopBar } from "@/components/layout/TopBar";
import { StatBig } from "@/components/ui/StatBig";
import { StatCard } from "@/components/ui/StatCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Ticker } from "@/components/ui/Ticker";
import { Tag } from "@/components/ui/Tag";
import { ReachChart } from "@/components/ui/ReachChart";

const tickerItems = [
  "r/indiehackers — 12 upvotes",
  "3 signups from Reddit",
  "SEO score improved 8pts",
  "r/SideProject — scheduled",
  "Cold email opened — 62%",
  "Playbook generated",
  "r/webdev — draft ready",
  "2 new referrals",
];

const activityFeed = [
  { time: "09:41", text: "Post approved in r/indiehackers — 12 upvotes so far", type: "post" },
  { time: "09:12", text: "3 signups attributed to Reddit thread", type: "signup" },
  { time: "08:55", text: "Weekly SEO audit completed — score 71/100", type: "audit" },
  { time: "Yesterday", text: "Playbook regenerated for vibereach.io", type: "playbook" },
  { time: "Yesterday", text: "Post drafted for r/SideProject — awaiting approval", type: "draft" },
  { time: "2 days ago", text: "Cold email campaign queued — 47 contacts", type: "email" },
];

const consultantFeed = [
  {
    tag: "fix" as const,
    title: "Add social proof above the fold",
    why: "No testimonials or user count visible before scroll. Conversion pages with social proof convert 34% better on average.",
  },
  {
    tag: "fix" as const,
    title: "Meta description is missing",
    why: "Google is auto-generating one from body text — it reads poorly. Write one under 160 chars with your core value prop.",
  },
  {
    tag: "add" as const,
    title: "Add an FAQ section",
    why: "Common objections go unanswered. An FAQ reduces support load and improves time-on-page for SEO.",
  },
  {
    tag: "good" as const,
    title: "Page load time is fast (1.1 s)",
    why: "Core Web Vitals are in the green. Keep image optimisation in place.",
  },
];

const typeIcon: Record<string, string> = {
  post: "▣", signup: "◈", audit: "◎", playbook: "◉", draft: "▣", email: "◇",
};
const typeColor: Record<string, string> = {
  post: "#3E8E4F", signup: "#3E8E4F", audit: "#F23005",
  playbook: "#17120C", draft: "#8A8071", email: "#5C5346",
};

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar
        breadcrumb={["vibereach.io"]}
        title="Dashboard"
        actions={
          <a
            href="/onboarding"
            className="text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-sm border shadow-hard-sm whitespace-nowrap"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              background: "#17120C",
              color: "#EFE7D6",
              borderColor: "#17120C",
            }}
          >
            + New Post
          </a>
        }
      />

      <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Ticker items={tickerItems} />

        {/* Hero stat + stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <StatBig
              value="4,812"
              label="Total Reach"
              sub="unique impressions this month"
              delta="+18% vs last month"
              deltaPositive
            />
          </div>
          <StatCard
            value="27"
            label="Posts Published"
            sub="across 9 subreddits"
            delta="+5 this week"
            deltaPositive
          />
          <StatCard
            value="71"
            label="SEO Score"
            sub="last audit — 3 days ago"
            delta="-2 from last run"
            deltaPositive={false}
            accent
          />
        </div>

        {/* Second stat row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard value="14" label="Drafts Awaiting" sub="approval in queue" />
          <StatCard
            value="8"
            label="Signups Attributed"
            sub="tracked via UTM"
            delta="+3 this week"
            deltaPositive
          />
          <StatCard value="62%" label="Email Open Rate" sub="cold outreach — last batch" accent />
        </div>

        {/* Chart + activity feed */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div
            className="lg:col-span-3 border rounded-sm p-4 sm:p-5"
            style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>Reach over time</SectionLabel>
              <span
                className="text-[0.62rem] uppercase tracking-[0.08em]"
                style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
              >
                Last 30 days
              </span>
            </div>
            <ReachChart />
          </div>

          <div
            className="lg:col-span-2 border rounded-sm p-4 sm:p-5"
            style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
          >
            <SectionLabel className="mb-4">Activity</SectionLabel>
            <ul className="space-y-3.5">
              {activityFeed.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="shrink-0 mt-0.5 text-[0.75rem] w-4 text-center"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      color: typeColor[item.type],
                    }}
                  >
                    {typeIcon[item.type]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs leading-snug" style={{ color: "#17120C" }}>
                      {item.text}
                    </p>
                    <p
                      className="text-[0.62rem] mt-0.5 uppercase tracking-[0.06em]"
                      style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
                    >
                      {item.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Consultant feed */}
        <div>
          <SectionLabel className="mb-4">What to do next</SectionLabel>
          <div className="space-y-2.5">
            {consultantFeed.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 sm:gap-4 border rounded-sm px-4 sm:px-5 py-4"
                style={{
                  background: "#F4EEE0",
                  borderColor:
                    item.tag === "fix"
                      ? "rgba(242,48,5,0.20)"
                      : item.tag === "good"
                      ? "rgba(62,142,79,0.20)"
                      : "rgba(23,18,12,0.14)",
                  borderLeft:
                    item.tag === "fix"
                      ? "3px solid #F23005"
                      : item.tag === "good"
                      ? "3px solid #3E8E4F"
                      : "3px solid rgba(23,18,12,0.20)",
                }}
              >
                <Tag variant={item.tag} className="mt-0.5 shrink-0">
                  {item.tag === "good" ? "Good" : item.tag === "fix" ? "Fix" : "Add"}
                </Tag>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#5C5346" }}>
                    {item.why}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
