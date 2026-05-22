"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScoreWheel } from "@/components/ui/ScoreWheel";
import { Tag } from "@/components/ui/Tag";
import type { AuditReport } from "@/lib/claude";

interface ReportRecord {
  reportId: string;
  url: string;
  score: number;
  report: AuditReport;
  createdAt: string;
}

// ── Demo shown when no real report exists ──────────────────────────────────
const DEMO: AuditReport = {
  score: 71,
  critical: [
    { title: "Add social proof above the fold", why: "No testimonials or user count visible before scroll. Conversion pages with social proof convert 34% better on average." },
    { title: "Meta description is missing", why: "Google is auto-generating from body text — it reads poorly. Write one under 160 chars with your core value prop." },
    { title: "No FAQ section", why: "Common objections go unanswered. An FAQ reduces support load and improves time-on-page for SEO." },
  ],
  recommended: [
    { title: "Add a demo video or GIF", why: "Your product has a clear visual workflow — a 60-second screen recording can double trial signups." },
    { title: "Increase contrast on subheadings", why: "h3 colour fails WCAG AA at current contrast ratio of 2.8:1." },
  ],
  headlineRewrite: "You shipped. Nobody came.",
  metaRewrite: "VibeReach analyses your product, posts natively on Reddit, and audits your landing page every week. Marketing autopilot for indie developers.",
  missingElements: ["Social proof", "FAQ", "Demo video", "Pricing comparison table"],
};

export default function AuditPage() {
  const [record,   setRecord]   = useState<ReportRecord | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [running,  setRunning]  = useState(false);
  const [error,    setError]    = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then(({ report }) => { if (report) setRecord(report); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function runAudit() {
    setRunning(true);
    setError("");
    try {
      const res  = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? "Audit failed."); return; }
      setRecord({ reportId: data.reportId ?? "local", url: "", score: data.report.score, report: data.report, createdAt: new Date().toISOString() });
    } catch {
      setError("Network error. Try again.");
    } finally {
      setRunning(false);
    }
  }

  const display = record?.report ?? DEMO;
  const isDemo  = !record;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar
        breadcrumb={["vibereach.io"]}
        title="SEO Audit"
        actions={
          <button
            onClick={runAudit}
            disabled={running}
            className="text-xs font-medium px-3 py-1.5 border rounded-sm whitespace-nowrap"
            style={{ fontFamily: "var(--font-jetbrains), monospace", borderColor: "rgba(23,18,12,0.20)", color: "#5C5346", opacity: running ? 0.6 : 1 }}
          >
            {running ? "Running..." : "Re-run audit"}
          </button>
        }
      />

      <main className="flex-1 p-4 sm:p-6 space-y-6">
        {isDemo && !loading && (
          <div className="border rounded-sm px-4 py-3 text-sm"
            style={{ background: "#F4EEE0", borderColor: "rgba(242,48,5,0.25)", borderLeft: "3px solid #F23005", color: "#5C5346" }}>
            Demo data — <button onClick={runAudit} disabled={running} style={{ color: "#F23005", fontWeight: 600 }}>run your first audit →</button>
          </div>
        )}

        {error && (
          <p className="text-xs" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}>{error}</p>
        )}

        {/* Score hero */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border rounded-sm p-5 sm:p-6"
          style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}>
          {loading ? (
            <div className="w-24 h-24 rounded-full border-4 animate-pulse" style={{ borderColor: "rgba(23,18,12,0.10)" }} />
          ) : (
            <ScoreWheel score={display.score} size={100} label="Score" />
          )}
          <div className="flex-1">
            <p className="text-xl sm:text-2xl font-bold leading-tight tracking-[-0.025em] mb-1"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
              {display.critical.length} critical · {display.recommended.length} recommended
            </p>
            <p className="text-sm" style={{ color: "#5C5346" }}>
              {record
                ? `Last audited ${new Date(record.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                : "Run your first audit above"}
            </p>
            {display.missingElements?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {display.missingElements.map((el) => (
                  <span key={el} className="text-[0.6rem] px-1.5 py-0.5 rounded-sm uppercase tracking-[0.06em]"
                    style={{ fontFamily: "var(--font-jetbrains), monospace", background: "rgba(242,48,5,0.08)", color: "#F23005" }}>
                    missing: {el}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fix / Working columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SectionLabel className="mb-4">Fix this week</SectionLabel>
            <div className="space-y-3">
              {display.critical.map((item, i) => (
                <div key={i} className="border rounded-sm px-4 py-4"
                  style={{ background: "#F4EEE0", borderColor: "rgba(242,48,5,0.20)", borderLeft: "3px solid #F23005" }}>
                  <div className="flex items-start gap-3">
                    <Tag variant="fix" className="mt-0.5 shrink-0">Fix</Tag>
                    <div>
                      <p className="text-sm font-semibold mb-1"
                        style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>{item.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#5C5346" }}>{item.why}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel className="mb-4">Recommended</SectionLabel>
            <div className="space-y-3">
              {display.recommended.map((item, i) => (
                <div key={i} className="border rounded-sm px-4 py-4"
                  style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)", borderLeft: "3px solid rgba(23,18,12,0.20)" }}>
                  <div className="flex items-start gap-3">
                    <Tag variant="add" className="mt-0.5 shrink-0">Add</Tag>
                    <div>
                      <p className="text-sm font-semibold mb-1"
                        style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>{item.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#5C5346" }}>{item.why}</p>
                    </div>
                  </div>
                </div>
              ))}
              {display.recommended.length === 0 && (
                <div className="border rounded-sm px-4 py-4" style={{ background: "#F4EEE0", borderColor: "rgba(62,142,79,0.20)", borderLeft: "3px solid #3E8E4F" }}>
                  <div className="flex items-start gap-3">
                    <Tag variant="good" className="mt-0.5 shrink-0">Good</Tag>
                    <p className="text-sm" style={{ color: "#5C5346" }}>No additional recommendations — solid baseline.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Headline + meta rewrite — dark block */}
        <div className="relative overflow-hidden rounded-sm p-5 sm:p-6 glow-vermilion" style={{ background: "#17120C" }}>
          <div className="relative z-10 space-y-5">
            <SectionLabel className="mb-0" light>Copy rewrites</SectionLabel>

            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.1em] mb-2"
                style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#5C5346" }}>Headline</p>
              <p className="text-xl sm:text-2xl font-bold tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#EFE7D6" }}>
                {display.headlineRewrite}
              </p>
            </div>

            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.1em] mb-2"
                style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#5C5346" }}>Meta description</p>
              <p className="text-sm leading-relaxed" style={{ color: "#8A8071" }}>{display.metaRewrite}</p>
            </div>
          </div>
        </div>

        {/* Email report */}
        {!isDemo && (
          <EmailReportForm
            sent={emailSent}
            onSent={() => setEmailSent(true)}
            report={display}
            url={record?.url ?? ""}
          />
        )}
      </main>
    </div>
  );
}

function EmailReportForm({ sent, onSent, report, url }: { sent: boolean; onSent: () => void; report: AuditReport; url: string }) {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, url }),
    }).catch(() => {});
    setLoading(false);
    onSent();
  }

  if (sent) return (
    <p className="text-xs" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#3E8E4F" }}>
      ✓ Report sent to your inbox.
    </p>
  );

  return (
    <form onSubmit={send} className="flex flex-col sm:flex-row gap-2">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email me this report"
        required
        className="flex-1 px-4 py-2.5 border text-sm outline-none"
        style={{ fontFamily: "var(--font-hanken), sans-serif", background: "#F4EEE0", borderColor: "rgba(23,18,12,0.25)", color: "#17120C" }} />
      <button type="submit" disabled={loading}
        className="px-4 py-2.5 text-xs font-semibold border rounded-sm shrink-0"
        style={{ fontFamily: "var(--font-jetbrains), monospace", background: "#17120C", color: "#EFE7D6", borderColor: "#17120C", opacity: loading ? 0.6 : 1 }}>
        {loading ? "Sending..." : "Send report"}
      </button>
    </form>
  );
}
