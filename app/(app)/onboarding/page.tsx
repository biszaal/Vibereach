"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Playbook } from "@/lib/claude";

type Stage = "input" | "analyzing" | "done" | "error";

const STEPS = [
  { label: "Fetching page...",                   ms: 800  },
  { label: "Extracting headings and copy...",    ms: 1800 },
  { label: "Identifying target personas...",     ms: 3000 },
  { label: "Scoring subreddit fit...",           ms: 4800 },
  { label: "Building marketing playbook...",     ms: 7000 },
  { label: "Finalising voice and tone...",       ms: 9000 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [url, setUrl]         = useState("");
  const [stage, setStage]     = useState<Stage>("input");
  const [errorMsg, setError]  = useState("");
  const [visibleSteps, setVisible] = useState<number[]>([]);
  const [result, setResult]   = useState<{ projectId: string; name: string; playbook: Playbook } | null>(null);
  const inputRef              = useRef<HTMLInputElement>(null);
  const startRef              = useRef<number>(0);

  // Animate terminal steps during analysis
  useEffect(() => {
    if (stage !== "analyzing") return;
    setVisible([]);
    startRef.current = Date.now();
    const timers = STEPS.map((step, i) =>
      window.setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, step.ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  // Redirect once done
  useEffect(() => {
    if (stage === "done" && result) {
      const delay = Math.max(400, 1200 - (Date.now() - startRef.current));
      const t = setTimeout(() => router.push("/playbook"), delay);
      return () => clearTimeout(t);
    }
  }, [stage, result, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    setStage("analyzing");
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Analysis failed. Try again.");
        setStage("error");
        return;
      }

      setResult(data);
      setStage("done");
    } catch {
      setError("Network error. Check your connection and try again.");
      setStage("error");
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Simple top bar without sidebar context needed */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b"
        style={{ borderColor: "rgba(23,18,12,0.14)" }}
      >
        <h1
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
        >
          New Project
        </h1>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="w-full max-w-lg">

          {/* ── Input stage ── */}
          {(stage === "input" || stage === "error") && (
            <div>
              <SectionLabel className="mb-5">Analyse a project</SectionLabel>
              <h2
                className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-[-0.03em] mb-3"
                style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
              >
                Paste your URL.
                <br />
                Get a playbook.
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "#5C5346" }}>
                VibeReach scrapes your landing page, sends it to Claude, and returns a full
                marketing playbook — personas, value props, voice, and a ranked list of
                subreddits to target.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-0">
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://myapp.com"
                    autoFocus
                    required
                    className="flex-1 px-4 py-3.5 border text-sm outline-none"
                    style={{
                      fontFamily: "var(--font-hanken), sans-serif",
                      background: "#F4EEE0",
                      borderColor: stage === "error" ? "#F23005" : "rgba(23,18,12,0.30)",
                      color: "#17120C",
                      borderRight: "none",
                    }}
                  />
                  <button
                    type="submit"
                    className="px-5 py-3.5 text-sm font-semibold border shadow-hard shrink-0"
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                      background: "#17120C",
                      color: "#EFE7D6",
                      borderColor: "#17120C",
                    }}
                  >
                    Analyse →
                  </button>
                </div>
                {stage === "error" && errorMsg && (
                  <p
                    className="mt-2.5 text-xs"
                    style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}
                  >
                    {errorMsg}
                  </p>
                )}
              </form>

              <p className="mt-5 text-xs" style={{ color: "#8A8071" }}>
                Works with any public URL. GitHub repos coming soon.
              </p>
            </div>
          )}

          {/* ── Analysing stage ── */}
          {(stage === "analyzing" || stage === "done") && (
            <div>
              <SectionLabel className="mb-5">
                {stage === "done" ? "Done" : "Analysing"}
              </SectionLabel>
              <p
                className="text-sm mb-1 truncate"
                style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
              >
                {url}
              </p>

              {/* Terminal block */}
              <div
                className="mt-4 border rounded-sm overflow-hidden"
                style={{ background: "#17120C", borderColor: "rgba(23,18,12,0.30)" }}
              >
                {/* Header */}
                <div
                  className="flex items-center gap-2 px-4 py-2.5 border-b"
                  style={{ borderColor: "rgba(239,231,214,0.10)" }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F23005" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#5C5346" }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#5C5346" }} />
                  <span
                    className="ml-2 text-[0.62rem] uppercase tracking-[0.12em]"
                    style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#5C5346" }}
                  >
                    vibereach — analysis
                  </span>
                </div>
                {/* Lines */}
                <div className="px-5 py-4 space-y-1.5 min-h-[160px]">
                  {STEPS.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 transition-opacity duration-300"
                      style={{ opacity: visibleSteps.includes(i) ? 1 : 0 }}
                    >
                      <span
                        className="text-[0.7rem] shrink-0"
                        style={{
                          fontFamily: "var(--font-jetbrains), monospace",
                          color:
                            stage === "done" || i < visibleSteps.length - 1
                              ? "#3E8E4F"
                              : "#F23005",
                        }}
                      >
                        {stage === "done" || i < visibleSteps.length - 1 ? "✓" : "→"}
                      </span>
                      <p
                        className="text-[0.73rem]"
                        style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
                      >
                        {step.label}
                      </p>
                    </div>
                  ))}
                  {stage === "done" && (
                    <div className="flex items-center gap-2.5 pt-1">
                      <span
                        className="text-[0.7rem]"
                        style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#3E8E4F" }}
                      >
                        ✓
                      </span>
                      <p
                        className="text-[0.73rem] font-semibold"
                        style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#EFE7D6" }}
                      >
                        Playbook ready — opening...
                      </p>
                    </div>
                  )}
                  {stage === "analyzing" && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span
                        className="inline-block w-1.5 h-3 animate-pulse"
                        style={{ background: "#F23005" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {result && stage === "done" && (
                <p
                  className="mt-4 text-xs"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
                >
                  Project: {result.name}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
