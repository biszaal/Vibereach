import { Suspense } from "react";
import { WaitlistForm } from "./WaitlistForm";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata = {
  title: "VibeReach — Join the waitlist",
  description:
    "Marketing autopilot for indie developers. Analyses your project, posts natively across channels, audits your landing page. Join the waitlist.",
};

async function getInitialCount(): Promise<number> {
  if (!process.env.AWS_ACCESS_KEY_ID) return 0;
  try {
    const { getWaitlistCount } = await import("@/lib/waitlist");
    return await getWaitlistCount();
  } catch {
    return 0;
  }
}

interface PageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function WaitlistPage({ searchParams }: PageProps) {
  const [count, params] = await Promise.all([
    getInitialCount(),
    searchParams,
  ]);
  const refCode = params.ref;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#EFE7D6" }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "rgba(23,18,12,0.14)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-5 h-5 flex items-center justify-center rounded-sm text-[0.65rem] font-bold"
            style={{ background: "#17120C", color: "#EFE7D6" }}
          >
            V
          </span>
          <span
            className="text-sm font-bold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
          >
            VibeReach
          </span>
        </div>
        <span
          className="text-[0.65rem] uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
        >
          Pre-launch
        </span>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-12 sm:py-24">
        <div className="w-full max-w-xl">
          {/* Kicker */}
          <SectionLabel className="mb-6">Early access</SectionLabel>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl font-extrabold leading-[1.05] tracking-[-0.03em] mb-6"
            style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
          >
            You shipped.
            <br />
            <span style={{ color: "#F23005" }}>Nobody came.</span>
          </h1>

          {/* Body copy */}
          <p className="text-base leading-relaxed mb-10 max-w-md" style={{ color: "#5C5346" }}>
            VibeReach is a marketing autopilot for indie developers.
            Connect your project once — it analyses it, posts natively across channels,
            and continuously audits your landing page.
            Like a growth hire who never sleeps, priced like an indie hacker built it.
          </p>

          {/* Form */}
          <Suspense>
            <WaitlistForm initialCount={count} initialRef={refCode} />
          </Suspense>
        </div>
      </main>

      {/* What we're building strip */}
      <section
        className="border-t px-4 sm:px-6 py-10"
        style={{ borderColor: "rgba(23,18,12,0.14)", background: "#E6DCC6" }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionLabel className="mb-6">What we&apos;re building</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "◉",
                title: "Project Analyser",
                desc: "Paste a URL or repo. Get back a full marketing playbook — personas, pain points, target subreddits ranked by fit.",
              },
              {
                icon: "▣",
                title: "Reddit Engine",
                desc: "3 post variations per subreddit, tuned to each sub's culture. You approve before anything goes live.",
              },
              {
                icon: "◎",
                title: "SEO Audit",
                desc: "Weekly score, prioritised fixes, headline and meta rewrites. Tells you exactly what to fix and why.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border p-5"
                style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
              >
                <span
                  className="block text-lg mb-3"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    color: "#F23005",
                  }}
                >
                  {item.icon}
                </span>
                <p
                  className="text-sm font-semibold mb-1.5"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
                >
                  {item.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#5C5346" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center gap-2 sm:justify-between"
        style={{ borderColor: "rgba(23,18,12,0.14)" }}
      >
        <span
          className="text-[0.65rem] uppercase tracking-[0.1em] text-center sm:text-left"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
        >
          VibeReach — built by an indie developer, for indie developers
        </span>
        <span
          className="text-[0.65rem] uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
        >
          Free to join
        </span>
      </footer>
    </div>
  );
}
