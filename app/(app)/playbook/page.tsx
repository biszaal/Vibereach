import { TopBar } from "@/components/layout/TopBar";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { Tag } from "@/components/ui/Tag";

const personas = [
  { name: "Solo dev", age: "28–38", desc: "Ships side projects on weekends. Strong builder, weak marketer. Lives on Hacker News and Reddit." },
  { name: "Indie hacker", age: "24–40", desc: "Bootstrapped micro-SaaS. Has 1-3 products. Watches MRR daily. Hates vague advice." },
  { name: "First-time founder", age: "22–32", desc: "Just left a job to build full-time. Six months of runway. Needs early traction fast." },
];

const subreddits = [
  { name: "indiehackers",  fitScore: 94, subscribers: "820k", angle: "founder story — show the build process" },
  { name: "SideProject",   fitScore: 91, subscribers: "180k", angle: "value-first — position as a tool that solves a real pain" },
  { name: "webdev",        fitScore: 78, subscribers: "1.4M", angle: "question-led — frame as a question about marketing workflows" },
  { name: "entrepreneur",  fitScore: 68, subscribers: "2.1M", angle: "value-first — keep it practical, no hype" },
  { name: "startups",      fitScore: 61, subscribers: "1.1M", angle: "founder story — honest about what is and isn't working" },
];

const terminalLines = [
  { text: "// product summary — vibereach.io", type: "comment" as const },
  { text: 'summary:  "Marketing autopilot for solo and small-team devs"', type: "key" as const },
  { text: 'tone:     "Direct, builder-to-builder, zero fluff"', type: "key" as const },
  { text: 'traits:   ["honest", "technical", "understated"]', type: "value" as const },
  { text: "", type: "plain" as const },
  { text: "// value props", type: "comment" as const },
  { text: '"Sounds human — not detectable AI spam"', type: "value" as const },
  { text: '"Respects each platform culture"', type: "value" as const },
  { text: '"Human-in-the-loop by default"', type: "value" as const },
];

export default function PlaybookPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar
        breadcrumb={["vibereach.io"]}
        title="Playbook"
        actions={
          <button
            className="text-xs font-medium px-3 py-1.5 border rounded-sm"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              borderColor: "rgba(23,18,12,0.20)",
              color: "#5C5346",
            }}
          >
            Re-analyse
          </button>
        }
      />
      <main className="flex-1 p-6 space-y-6">
        {/* Product summary — dark card */}
        <TerminalBlock lines={terminalLines} title="playbook.json" />

        {/* Personas */}
        <div>
          <SectionLabel className="mb-4">Target personas</SectionLabel>
          <div className="grid grid-cols-3 gap-4">
            {personas.map((p, i) => (
              <div
                key={i}
                className="border rounded-sm p-4"
                style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <p
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
                  >
                    {p.name}
                  </p>
                  <span
                    className="text-[0.6rem] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-sm"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      background: "rgba(23,18,12,0.08)",
                      color: "#8A8071",
                    }}
                  >
                    {p.age}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#5C5346" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subreddits */}
        <div>
          <SectionLabel className="mb-4">Target subreddits</SectionLabel>
          <div className="border rounded-sm overflow-hidden" style={{ borderColor: "rgba(23,18,12,0.14)" }}>
            {subreddits.map((sub, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3.5 border-b last:border-0"
                style={{
                  background: i % 2 === 0 ? "#F4EEE0" : "#EFE7D6",
                  borderColor: "rgba(23,18,12,0.10)",
                }}
              >
                <span
                  className="text-sm font-semibold w-36 shrink-0"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#17120C" }}
                >
                  r/{sub.name}
                </span>
                <span
                  className="text-xs w-16 shrink-0"
                  style={{ color: "#8A8071" }}
                >
                  {sub.subscribers}
                </span>
                <div className="flex items-center gap-2 w-24 shrink-0">
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(23,18,12,0.10)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${sub.fitScore}%`,
                        background: sub.fitScore >= 80 ? "#3E8E4F" : sub.fitScore >= 60 ? "#F23005" : "#8A8071",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold w-6 text-right"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      color: sub.fitScore >= 80 ? "#3E8E4F" : "#5C5346",
                    }}
                  >
                    {sub.fitScore}
                  </span>
                </div>
                <p className="flex-1 text-xs" style={{ color: "#5C5346" }}>{sub.angle}</p>
                <button
                  className="text-xs font-semibold px-3 py-1 rounded-sm border shadow-hard-sm shrink-0"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    background: "#17120C",
                    color: "#EFE7D6",
                    borderColor: "#17120C",
                  }}
                >
                  Draft post
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
