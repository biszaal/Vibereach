import { Suspense } from "react";
import { WaitlistForm } from "./WaitlistForm";

export const metadata = {
  title: "VibeReach — Join the waitlist",
  description:
    "Marketing autopilot for indie developers. Analyses your project, posts natively across channels, audits your landing page. Get in before launch.",
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

async function getStatus(code?: string) {
  if (!code || !process.env.AWS_ACCESS_KEY_ID) return undefined;
  try {
    const { getWaitlistStatusByCode } = await import("@/lib/waitlist");
    const s = await getWaitlistStatusByCode(code);
    return s ?? undefined;
  } catch {
    return undefined;
  }
}

interface PageProps {
  searchParams: Promise<{ ref?: string; me?: string }>;
}

const PIPES = [
  { name: "Analyse", status: "Done",     done: true,  building: false, desc: "Reads your product, builds a marketing playbook and finds your subreddits." },
  { name: "Post",    status: "Building", done: false, building: true,  desc: "Native-feeling Reddit posts and warm cold email, drip-scheduled and spam-safe." },
  { name: "Improve", status: "Next",     done: false, building: false, desc: "Weekly SEO and conversion audits with rewrites you can ship in a click." },
];

export default async function WaitlistPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [count, status] = await Promise.all([getInitialCount(), getStatus(params.me)]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#EFE7D6" }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-5 border-b"
        style={{ borderColor: "rgba(23,18,12,0.14)" }}
      >
        <div
          className="flex items-center gap-2 font-extrabold tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "22px", color: "#17120C" }}
        >
          VibeReach
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F23005" }} />
        </div>
        <div
          className="flex items-center gap-2 border rounded-full px-3.5 py-1.5"
          style={{ borderColor: "rgba(23,18,12,0.28)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#3E8E4F" }} />
          <span
            className="text-[0.63rem] uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#5C5346" }}
          >
            Building in public
          </span>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="w-full max-w-[600px]">
          <Suspense>
            <WaitlistForm
              initialCount={count}
              initialRef={params.ref}
              initialStatus={
                status
                  ? {
                      boostedPosition: status.boostedPosition,
                      referralCount: status.referralCount,
                      spotsSkipped: status.spotsSkipped,
                      referralCode: status.referralCode,
                    }
                  : undefined
              }
            />
          </Suspense>
        </div>
      </main>

      {/* What we're shipping */}
      <section
        className="border-t px-4 sm:px-8 py-10"
        style={{ borderColor: "rgba(23,18,12,0.14)", background: "#E6DCC6" }}
      >
        <div className="max-w-[760px] mx-auto">
          <p
            className="text-center text-[0.63rem] uppercase tracking-[0.14em] mb-6"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
          >
            — What we&apos;re shipping —
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {PIPES.map((pipe) => (
              <div
                key={pipe.name}
                className="border rounded-sm p-4"
                style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="font-bold text-sm"
                    style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
                  >
                    {pipe.name}
                  </span>
                  <span
                    className="text-[0.6rem] font-bold uppercase tracking-[0.08em] px-2 py-1 rounded-sm"
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      background: pipe.done ? "rgba(62,142,79,0.14)" : pipe.building ? "#F23005" : "transparent",
                      color: pipe.done ? "#3E8E4F" : pipe.building ? "#EFE7D6" : "#8A8071",
                      border: !pipe.done && !pipe.building ? "1px solid rgba(23,18,12,0.28)" : "none",
                    }}
                  >
                    {pipe.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#5C5346" }}>{pipe.desc}</p>
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
          className="text-[0.63rem] uppercase tracking-[0.1em] text-center sm:text-left"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
        >
          VibeReach — built by an indie developer, for indie developers
        </span>
        <span
          className="text-[0.63rem] uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
        >
          Free to join
        </span>
      </footer>
    </div>
  );
}
