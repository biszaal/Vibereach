import { cookies } from "next/headers";
import { TopBar } from "@/components/layout/TopBar";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { Tag } from "@/components/ui/Tag";
import type { Playbook, Persona, Subreddit } from "@/lib/claude";

async function getPlaybook(): Promise<{ playbook: Playbook | null; projectName: string }> {
  if (!process.env.AWS_ACCESS_KEY_ID) return { playbook: null, projectName: "" };
  try {
    const cookieStore = await cookies();
    const projectId = cookieStore.get("currentProjectId")?.value;
    if (!projectId) return { playbook: null, projectName: "" };
    const { getProject } = await import("@/lib/projects");
    const project = await getProject(projectId);
    return {
      playbook: project?.playbook ?? null,
      projectName: project?.name ?? project?.url ?? "",
    };
  } catch {
    return { playbook: null, projectName: "" };
  }
}

// Demo data shown before any project is analysed
const DEMO: Playbook = {
  summary: "A marketing autopilot for indie developers who can build anything but struggle to get traction",
  personas: [
    { name: "Solo dev", age: "28–38", description: "Ships side projects on weekends. Strong builder, weak marketer. Lives on Hacker News and Reddit." },
    { name: "Indie hacker", age: "24–40", description: "Bootstrapped micro-SaaS. Has 1-3 products. Watches MRR daily. Hates vague advice." },
    { name: "First-time founder", age: "22–32", description: "Just left a job to build full-time. Six months of runway. Needs early traction fast." },
  ],
  pains: [
    "Launches to silence — no distribution network",
    "Marketing feels inauthentic and time-consuming",
    "No idea which channels work for their product",
    "Previous posts got banned or removed",
  ],
  valueProps: [
    "Sounds human — not detectable AI spam",
    "Respects each platform's culture and rules",
    "Human-in-the-loop by default",
    "Priced like an indie hacker built it",
  ],
  voice: { tone: "direct", traits: ["honest", "technical", "understated", "builder-to-builder"] },
  subreddits: [
    { name: "indiehackers",  fitScore: 94, subscribers: "820k", angle: "founder story — show the build process" },
    { name: "SideProject",   fitScore: 91, subscribers: "180k", angle: "value-first — position as a tool for a real pain" },
    { name: "webdev",        fitScore: 78, subscribers: "1.4M", angle: "question-led — frame as a question about marketing workflows" },
    { name: "entrepreneur",  fitScore: 68, subscribers: "2.1M", angle: "value-first — keep it practical, no hype" },
    { name: "startups",      fitScore: 61, subscribers: "1.1M", angle: "founder story — honest about what is and isn't working" },
  ],
};

function terminalLines(playbook: Playbook) {
  return [
    { text: "// product summary", type: "comment" as const },
    { text: `summary: "${playbook.summary}"`, type: "key" as const },
    { text: "", type: "plain" as const },
    { text: "// voice", type: "comment" as const },
    { text: `tone:   "${playbook.voice.tone}"`, type: "key" as const },
    { text: `traits: [${playbook.voice.traits.map((t) => `"${t}"`).join(", ")}]`, type: "value" as const },
    { text: "", type: "plain" as const },
    { text: "// value props", type: "comment" as const },
    ...playbook.valueProps.map((v) => ({ text: `"${v}"`, type: "value" as const })),
  ];
}

export default async function PlaybookPage() {
  const { playbook: realPlaybook, projectName } = await getPlaybook();
  const playbook = realPlaybook ?? DEMO;
  const isDemo = !realPlaybook;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar
        breadcrumb={[projectName || "vibereach.io"]}
        title="Playbook"
        actions={
          <a
            href="/onboarding"
            className="text-xs font-medium px-3 py-1.5 border rounded-sm whitespace-nowrap"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              borderColor: "rgba(23,18,12,0.20)",
              color: "#5C5346",
            }}
          >
            {isDemo ? "+ Analyse project" : "Re-analyse"}
          </a>
        }
      />

      <main className="flex-1 p-4 sm:p-6 space-y-6">
        {isDemo && (
          <div
            className="border rounded-sm px-4 py-3 text-sm"
            style={{
              background: "#F4EEE0",
              borderColor: "rgba(242,48,5,0.25)",
              borderLeft: "3px solid #F23005",
              color: "#5C5346",
            }}
          >
            This is demo data.{" "}
            <a href="/onboarding" style={{ color: "#F23005", fontWeight: 600 }}>
              Analyse your project →
            </a>{" "}
            to see your real playbook.
          </div>
        )}

        {/* Summary terminal block */}
        <TerminalBlock lines={terminalLines(playbook)} title="playbook.json" />

        {/* Personas */}
        <div>
          <SectionLabel className="mb-4">Target personas</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playbook.personas.map((p: Persona, i: number) => (
              <div
                key={i}
                className="border rounded-sm p-4"
                style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <p
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
                  >
                    {p.name}
                  </p>
                  <span
                    className="text-[0.6rem] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-sm"
                    style={{ fontFamily: "var(--font-jetbrains), monospace", background: "rgba(23,18,12,0.08)", color: "#8A8071" }}
                  >
                    {p.age}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#5C5346" }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pains */}
        <div>
          <SectionLabel className="mb-4">Pain points</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {playbook.pains.map((pain: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 border rounded-sm px-4 py-3"
                style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
              >
                <span
                  className="mt-0.5 text-[0.7rem] shrink-0"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}
                >
                  →
                </span>
                <p className="text-sm" style={{ color: "#17120C" }}>
                  {pain}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Subreddits */}
        <div>
          <SectionLabel className="mb-4">Target subreddits — ranked by fit</SectionLabel>
          <div className="border rounded-sm overflow-hidden" style={{ borderColor: "rgba(23,18,12,0.14)" }}>
            {playbook.subreddits.map((sub: Subreddit, i: number) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 border-b last:border-0"
                style={{
                  background: i % 2 === 0 ? "#F4EEE0" : "#EFE7D6",
                  borderColor: "rgba(23,18,12,0.10)",
                }}
              >
                <span
                  className="text-sm font-semibold sm:w-36 shrink-0"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#17120C" }}
                >
                  r/{sub.name}
                </span>
                <span className="text-xs sm:w-14 shrink-0" style={{ color: "#8A8071" }}>
                  {sub.subscribers}
                </span>
                <div className="flex items-center gap-2 sm:w-24 shrink-0">
                  <div
                    className="flex-1 sm:flex-none sm:w-16 h-1.5 rounded-full overflow-hidden"
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
                    className="text-xs font-semibold w-6 text-right shrink-0"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      color: sub.fitScore >= 80 ? "#3E8E4F" : "#5C5346",
                    }}
                  >
                    {sub.fitScore}
                  </span>
                </div>
                <p className="flex-1 text-xs" style={{ color: "#5C5346" }}>
                  {sub.angle}
                </p>
                <a
                  href="/reddit"
                  className="text-xs font-semibold px-3 py-1 rounded-sm border shadow-hard-sm shrink-0 self-start sm:self-auto"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    background: "#17120C",
                    color: "#EFE7D6",
                    borderColor: "#17120C",
                  }}
                >
                  Draft post
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
