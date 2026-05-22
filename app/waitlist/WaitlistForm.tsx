"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  initialCount: number;
  initialRef?: string;
}

const statusSteps = [
  { label: "Foundation",  done: true  },
  { label: "Waitlist",    done: true  },
  { label: "Analyser",    done: false, active: true },
  { label: "Reddit",      done: false },
  { label: "SEO Audit",   done: false },
  { label: "Dashboard",   done: false },
  { label: "Launch",      done: false },
];

export function WaitlistForm({ initialCount, initialRef }: Props) {
  const [email, setEmail]         = useState("");
  const [status, setStatus]       = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg]   = useState("");
  const [count, setCount]         = useState(initialCount);
  const [position, setPosition]   = useState(0);
  const [refCode, setRefCode]     = useState("");
  const [copied, setCopied]       = useState(false);
  const inputRef                  = useRef<HTMLInputElement>(null);

  // Live-refresh count every 30 s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/waitlist/count");
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch { /* silent */ }
    }, 30_000);
    return () => clearInterval(interval);
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
        if (data.error === "invalid_email") {
          setErrorMsg("That doesn't look like a valid email address.");
        } else if (res.status === 503) {
          setErrorMsg("Waitlist is coming soon — check back shortly.");
        } else {
          setErrorMsg("Something went wrong. Try again in a moment.");
        }
        setStatus("error");
        return;
      }

      setPosition(data.position);
      setRefCode(data.referralCode);
      if (!data.alreadyJoined) setCount((c) => c + 1);
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/waitlist?ref=${refCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const referralUrl = typeof window !== "undefined"
    ? `${window.location.origin}/waitlist?ref=${refCode}`
    : `/waitlist?ref=${refCode}`;

  if (status === "success") {
    return (
      <div className="space-y-8">
        {/* Position hero */}
        <div
          className="border p-8"
          style={{
            background: "#17120C",
            borderColor: "#17120C",
            boxShadow: "6px 6px 0 rgba(23,18,12,0.25)",
          }}
        >
          <p
            className="text-[0.68rem] uppercase tracking-[0.12em] mb-3"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#5C5346" }}
          >
            Queue position
          </p>
          <p
            className="text-6xl sm:text-8xl font-extrabold leading-none tracking-[-0.04em] mb-2"
            style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#EFE7D6" }}
          >
            #{position}
          </p>
          <p className="text-base" style={{ color: "#8A8071" }}>
            You&apos;re on the list. A confirmation is on its way.
          </p>
        </div>

        {/* Referral */}
        <div
          className="border p-6"
          style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
        >
          <p
            className="text-[0.68rem] uppercase tracking-[0.12em] mb-1"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
          >
            Refer 3 friends to skip the queue
          </p>
          <p className="text-sm mb-4" style={{ color: "#5C5346" }}>
            Share your personal link. Every person who signs up through it moves you forward.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={referralUrl}
              className="flex-1 px-3 py-2.5 border text-xs min-w-0 outline-none"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                background: "#EFE7D6",
                borderColor: "rgba(23,18,12,0.20)",
                color: "#5C5346",
              }}
            />
            <button
              onClick={copyLink}
              className="px-4 py-2.5 min-h-[44px] text-xs font-semibold border rounded-sm shadow-hard-sm shrink-0 transition-none"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                background: copied ? "#3E8E4F" : "#17120C",
                color: "#EFE7D6",
                borderColor: copied ? "#3E8E4F" : "#17120C",
              }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* What's next */}
        <div>
          <p
            className="text-[0.68rem] uppercase tracking-[0.12em] mb-3"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
          >
            What happens next
          </p>
          <ul className="space-y-2.5">
            {[
              "We're building the Reddit Engine and Project Analyser now.",
              "Early-access invites go out in order — position matters.",
              "You'll get one email when it's your turn. No newsletter.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 shrink-0 text-[0.75rem]"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}
                >
                  →
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "#5C5346" }}>
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex gap-0 flex-col sm:flex-row">
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            required
            className="flex-1 px-4 py-3.5 border text-sm outline-none focus:ring-0 sm:border-r-0"
            style={{
              fontFamily: "var(--font-hanken), sans-serif",
              background: "#F4EEE0",
              borderColor: status === "error" ? "#F23005" : "rgba(23,18,12,0.30)",
              color: "#17120C",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3.5 text-sm font-semibold border shadow-hard shrink-0"
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              background: "#17120C",
              color: "#EFE7D6",
              borderColor: "#17120C",
              opacity: status === "loading" ? 0.7 : 1,
              cursor: status === "loading" ? "wait" : "pointer",
            }}
          >
            {status === "loading" ? "Joining..." : "Join the waitlist →"}
          </button>
        </div>
        {status === "error" && errorMsg && (
          <p
            className="mt-2 text-xs"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}
          >
            {errorMsg}
          </p>
        )}
      </form>

      {/* Counter */}
      <div className="flex items-center gap-3">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: "#3E8E4F" }}
        />
        <p
          className="text-sm"
          style={{ color: "#5C5346" }}
        >
          <span
            className="font-semibold"
            style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
          >
            {count > 0 ? count.toLocaleString() : "—"}
          </span>{" "}
          {count === 1 ? "developer" : "developers"} waiting
        </p>
      </div>

      {/* Status strip */}
      <div
        className="border-t pt-8"
        style={{ borderColor: "rgba(23,18,12,0.14)" }}
      >
        <p
          className="text-[0.65rem] uppercase tracking-[0.14em] mb-4"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
        >
          Build progress
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {statusSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="text-[0.7rem]"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: step.done ? "#3E8E4F" : step.active ? "#F23005" : "#8A8071",
                }}
              >
                {step.done ? "✓" : step.active ? "→" : "○"}
              </span>
              <span
                className="text-[0.72rem]"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  color: step.done ? "#17120C" : step.active ? "#17120C" : "#8A8071",
                  fontWeight: step.active ? "600" : "400",
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
