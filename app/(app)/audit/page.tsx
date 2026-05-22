import { TopBar } from "@/components/layout/TopBar";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScoreWheel } from "@/components/ui/ScoreWheel";
import { Tag } from "@/components/ui/Tag";

const critical = [
  {
    title: "Add social proof above the fold",
    why: "No testimonials or user count visible before scroll. Conversion pages with social proof convert 34% better.",
  },
  {
    title: "Meta description is missing",
    why: "Google is auto-generating from body text. Write one under 160 chars with your core value prop.",
  },
  {
    title: "No FAQ section",
    why: "Common objections go unanswered — this is the most frequently cited reason for bounce on SaaS landing pages.",
  },
];

const working = [
  { title: "Page load time — 1.1 s", why: "Core Web Vitals are in the green. LCP 0.9 s, CLS 0.01." },
  { title: "Mobile layout is clean", why: "Tested at 375 px and 390 px. No overflow, readable type sizes." },
  { title: "Clear primary CTA", why: "Single CTA above the fold. No competing calls to action." },
];

export default function AuditPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar
        breadcrumb={["vibereach.io"]}
        title="SEO Audit"
        actions={
          <button
            className="text-xs font-medium px-3 py-1.5 border rounded-sm whitespace-nowrap"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              borderColor: "rgba(23,18,12,0.20)",
              color: "#5C5346",
            }}
          >
            Re-run
          </button>
        }
      />
      <main className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Score + summary */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border rounded-sm p-5 sm:p-6"
          style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
        >
          <ScoreWheel score={71} size={100} label="Overall Score" />
          <div className="flex-1">
            <p
              className="text-xl sm:text-2xl font-bold leading-tight tracking-[-0.025em] mb-1"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
            >
              3 critical fixes, 2 recommended
            </p>
            <p className="text-sm" style={{ color: "#5C5346" }}>
              Last audited 3 days ago — vibereach.io
            </p>
            <p
              className="mt-2 text-[0.65rem] uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
            >
              Load time 1.1 s · Mobile-friendly · 1,240 words
            </p>
          </div>
        </div>

        {/* Two columns — stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SectionLabel className="mb-4">Fix this week</SectionLabel>
            <div className="space-y-3">
              {critical.map((item, i) => (
                <div
                  key={i}
                  className="border rounded-sm px-4 py-4"
                  style={{
                    background: "#F4EEE0",
                    borderColor: "rgba(242,48,5,0.20)",
                    borderLeft: "3px solid #F23005",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Tag variant="fix" className="mt-0.5 shrink-0">Fix</Tag>
                    <div>
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
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel className="mb-4">Working well</SectionLabel>
            <div className="space-y-3">
              {working.map((item, i) => (
                <div
                  key={i}
                  className="border rounded-sm px-4 py-4"
                  style={{
                    background: "#F4EEE0",
                    borderColor: "rgba(62,142,79,0.20)",
                    borderLeft: "3px solid #3E8E4F",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Tag variant="good" className="mt-0.5 shrink-0">Good</Tag>
                    <div>
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Headline rewrite */}
        <div
          className="relative overflow-hidden rounded-sm p-5 sm:p-6 glow-vermilion"
          style={{ background: "#17120C" }}
        >
          <div className="relative z-10">
            <SectionLabel className="mb-4" light>Headline rewrite</SectionLabel>
            <p
              className="text-[0.65rem] uppercase tracking-[0.1em] mb-2"
              style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#5C5346" }}
            >
              Current
            </p>
            <p
              className="text-base sm:text-lg font-semibold mb-4 line-through"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#5C5346" }}
            >
              Marketing tools for developers
            </p>
            <p
              className="text-[0.65rem] uppercase tracking-[0.1em] mb-2"
              style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#5C5346" }}
            >
              Suggested
            </p>
            <p
              className="text-xl sm:text-2xl font-bold tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#EFE7D6" }}
            >
              You shipped. Nobody came.
            </p>
            <p className="mt-2 text-sm" style={{ color: "#8A8071" }}>
              Uses the user&apos;s pain as the hook — more honest, less generic.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
