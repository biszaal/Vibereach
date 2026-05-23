"use client";

import { useState, useEffect } from "react";

interface InitialStatus {
  boostedPosition: number;
  referralCount: number;
  spotsSkipped: number;
  referralCode: string;
}

interface Props {
  initialCount: number;
  initialRef?: string;
  initialStatus?: InitialStatus;
}

const AVATARS = [
  { bg: "#F23005", l: "M" },
  { bg: "#17120C", l: "S" },
  { bg: "#5B8FC7", l: "J" },
  { bg: "#3E8E4F", l: "+" },
];

function progressLine(referralCount: number, spotsSkipped: number): string {
  if (referralCount === 0) return "Share to start climbing — 5 spots per friend.";
  const friend = referralCount === 1 ? "friend" : "friends";
  const spot = spotsSkipped === 1 ? "spot" : "spots";
  return `${referralCount} ${friend} joined · ${spotsSkipped} ${spot} skipped`;
}

// ── Shared result view (success + status modes) ─────────────────────────────

interface ResultViewProps {
  headline: string;
  subcopy: string;
  position: number;
  referralCount: number;
  spotsSkipped: number;
  referralCode: string;
  showCheck: boolean;
}

function ResultView({
  headline,
  subcopy,
  position,
  referralCount,
  spotsSkipped,
  referralCode,
  showCheck,
}: ResultViewProps) {
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const inviteUrl = `${origin}/waitlist?ref=${referralCode}`;
  const statusUrl = `${origin}/waitlist?me=${referralCode}`;
  const atFront = position <= 1;

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareX() {
    const text = encodeURIComponent(
      "Joined the waitlist for VibeReach — marketing autopilot for builders. You ship, it makes sure people hear about it."
    );
    const url = encodeURIComponent(inviteUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  }

  return (
    <div className="space-y-7">
      {showCheck && (
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto font-bold" style={{ background: "#3E8E4F", color: "#EFE7D6" }}>
          ✓
        </div>
      )}

      <h2
        className="font-extrabold tracking-[-0.025em] text-center"
        style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#17120C" }}
      >
        {headline}
      </h2>

      <p className="text-center leading-relaxed" style={{ fontSize: "17px", color: "#5C5346" }}>
        {subcopy}
      </p>

      {/* Position card */}
      <div className="relative overflow-hidden rounded-sm p-7" style={{ background: "#17120C" }}>
        <div className="absolute top-[-40%] right-[-10%] w-[300px] h-[300px] pointer-events-none" style={{ background: "radial-gradient(circle, #F23005 0%, transparent 65%)", opacity: 0.40 }} />
        <div className="relative">
          <div className="text-[0.63rem] uppercase tracking-[0.12em] mb-1.5" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "rgba(239,231,214,0.50)" }}>
            Your position in line
          </div>
          <div className="font-extrabold leading-none tracking-[-0.04em] mb-3" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(2.5rem, 10vw, 4rem)", color: "#EFE7D6" }}>
            #<span style={{ color: "#F23005" }}>{position}</span>
          </div>
          <div style={{ fontSize: "13.5px", color: "rgba(239,231,214,0.65)" }}>
            {atFront ? (
              <strong style={{ color: "#EFE7D6" }}>Front of the line. You&apos;re first.</strong>
            ) : (
              progressLine(referralCount, spotsSkipped)
            )}
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex gap-2.5 flex-wrap">
        <button
          onClick={copyLink}
          className="flex-1 min-w-[140px] min-h-[44px] text-[0.7rem] font-bold py-3 px-4 border rounded-sm"
          style={{
            fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "0.06em", textTransform: "uppercase",
            background: copied ? "#3E8E4F" : "#F23005",
            color: "#EFE7D6",
            borderColor: copied ? "#3E8E4F" : "#F23005",
          }}
        >
          {copied ? "Copied ✓" : "Copy invite link"}
        </button>
        <button
          onClick={shareX}
          className="flex-1 min-w-[140px] min-h-[44px] text-[0.7rem] font-bold py-3 px-4 border rounded-sm"
          style={{ fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "0.06em", textTransform: "uppercase", borderColor: "#17120C", color: "#17120C" }}
        >
          Share on X
        </button>
      </div>

      {/* Bookmark / check your spot */}
      <p className="text-center text-xs" style={{ color: "#8A8071" }}>
        <a href={statusUrl} className="underline" style={{ color: "#5C5346", textUnderlineOffset: "3px" }}>
          Bookmark your spot
        </a>{" "}
        — come back any time to watch it climb.
      </p>
    </div>
  );
}

// ── Form ────────────────────────────────────────────────────────────────────

export function WaitlistForm({ initialCount, initialRef, initialStatus }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [count, setCount] = useState(initialCount);
  const [result, setResult] = useState<{
    position: number;
    referralCount: number;
    spotsSkipped: number;
    referralCode: string;
  } | null>(null);

  // Live-refresh count every 30 s
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/waitlist/count");
        if (res.ok) { const d = await res.json(); setCount(d.count); }
      } catch { /* silent */ }
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), referralCode: initialRef }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(
          data.error === "invalid_email" ? "That doesn't look like a valid email." :
          res.status === 503             ? "Waitlist coming soon — check back shortly." :
                                          "Something went wrong. Try again."
        );
        setStatus("error");
        return;
      }
      setResult({
        position: data.position,
        referralCount: data.referralCount,
        spotsSkipped: data.spotsSkipped,
        referralCode: data.referralCode,
      });
      if (!data.alreadyJoined) setCount((c) => c + 1);
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Check your connection.");
      setStatus("error");
    }
  }

  // ── Status mode (bookmarked ?me= link) ────────────────────────────────────
  if (initialStatus) {
    return (
      <ResultView
        headline="Your spot"
        subcopy="Every friend who joins moves you up 5 spots. Keep sharing."
        position={initialStatus.boostedPosition}
        referralCount={initialStatus.referralCount}
        spotsSkipped={initialStatus.spotsSkipped}
        referralCode={initialStatus.referralCode}
        showCheck={false}
      />
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (status === "success" && result) {
    return (
      <ResultView
        headline="You're in."
        subcopy="We'll email you the moment VibeReach opens. Want in sooner?"
        position={result.position}
        referralCount={result.referralCount}
        spotsSkipped={result.spotsSkipped}
        referralCode={result.referralCode}
        showCheck={true}
      />
    );
  }

  // ── Idle / error state ────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Kicker */}
      <div className="inline-flex items-center gap-2.5 border rounded-full px-4 py-2" style={{ borderColor: "rgba(23,18,12,0.28)", background: "rgba(255,255,255,0.22)" }}>
        <span className="relative flex-shrink-0">
          <span className="block w-2 h-2 rounded-full" style={{ background: "#F23005" }} />
          <span className="absolute inset-[-4px] rounded-full border animate-ping" style={{ borderColor: "#F23005", animationDuration: "2s" }} />
        </span>
        <span className="text-[0.63rem] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#17120C" }}>
          Launching late 2026
        </span>
      </div>

      {/* Headline */}
      <div>
        <h1
          className="font-extrabold leading-[0.93] tracking-[-0.035em] mb-5"
          style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(2.5rem, 7vw, 4rem)", color: "#17120C" }}
        >
          You ship.<br />
          We make sure they <span style={{ color: "#F23005" }}>hear about it.</span>
        </h1>
        <p className="leading-relaxed max-w-md" style={{ fontSize: "17px", color: "#5C5346" }}>
          VibeReach is the marketing autopilot for builders — Reddit, cold email and SEO on rails.{" "}
          <strong style={{ color: "#17120C", fontWeight: 600 }}>We&apos;re building it now.</strong>{" "}
          Get in before launch.
        </p>
      </div>

      {/* Form */}
      <div>
        <form onSubmit={handleSubmit} noValidate>
          <div
            className="flex items-center gap-2 px-4 pr-2 rounded-sm max-w-[440px]"
            style={{
              background: "#F4EEE0",
              border: `1px solid ${status === "error" ? "#F23005" : "#17120C"}`,
              boxShadow: "5px 5px 0 rgba(23,18,12,0.10)",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourproject.com"
              autoComplete="email"
              required
              className="flex-1 py-3.5 text-[15px] outline-none bg-transparent min-w-0"
              style={{ fontFamily: "var(--font-hanken), sans-serif", color: "#17120C" }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 my-1.5 text-[0.7rem] font-bold px-5 py-3 rounded-sm whitespace-nowrap"
              style={{
                fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "0.08em", textTransform: "uppercase",
                background: "#F23005", color: "#EFE7D6",
                opacity: status === "loading" ? 0.7 : 1,
              }}
            >
              {status === "loading" ? "Joining..." : "Join the list →"}
            </button>
          </div>
        </form>

        {status === "error" && errorMsg && (
          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.04em]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}>
            {errorMsg}
          </p>
        )}

        {/* Micro copy */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3.5">
          {["No spam, ever", "First 500 get Pro free for 3 months"].map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-xs" style={{ color: "#8A8071" }}>
              <span className="font-bold text-[0.63rem]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}>✓</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Counter with avatars */}
      <div className="flex items-center gap-3.5">
        <div className="flex">
          {AVATARS.map((av, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-extrabold shrink-0"
              style={{ background: av.bg, color: "#EFE7D6", fontFamily: "var(--font-bricolage), sans-serif", borderColor: "#EFE7D6", marginLeft: i === 0 ? 0 : "-9px" }}
            >
              {av.l}
            </div>
          ))}
        </div>
        <div className="text-sm" style={{ color: "#5C5346" }}>
          <span className="font-extrabold" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "16px", color: "#17120C" }}>
            {count > 0 ? count.toLocaleString() : "—"}
          </span>{" "}
          builders already waiting
        </div>
      </div>
    </div>
  );
}
