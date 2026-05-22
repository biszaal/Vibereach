"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface UsageData {
  plan: "free" | "starter" | "pro";
  limits: { postsPerMonth: number | null; auditsPerMonth: number | null; projects: number | null };
  usage: { posts: number; audits: number; projects: number };
}

const PLAN_LABELS = { free: "Free", starter: "Starter", pro: "Pro" };
const PLAN_PRICES = { free: "Free", starter: "£15/mo", pro: "£49/mo" };

const CHANNELS = [
  { key: "reddit",   name: "Reddit",     icon: "▣", cookieKey: "reddit_username" },
  { key: "x",        name: "X / Twitter", icon: "◇", pro: false },
  { key: "linkedin", name: "LinkedIn",   icon: "◇", pro: false },
  { key: "email",    name: "Cold Email", icon: "◉", pro: true  },
];

export default function SettingsPage() {
  const [usage,     setUsage]     = useState<UsageData | null>(null);
  const [username,  setUsername]  = useState<string | null>(null);
  const [deleting,  setDeleting]  = useState(false);
  const [toast,     setToast]     = useState("");

  useEffect(() => {
    // Reddit connected username from cookie
    const u = document.cookie.match(/reddit_username=([^;]+)/)?.[1];
    if (u) setUsername(decodeURIComponent(u));

    // URL feedback from OAuth redirect
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("reddit") === "connected") setToast("Reddit connected successfully.");
    if (sp.get("reddit") === "denied")    setToast("Reddit connection was cancelled.");
    if (sp.get("reddit") === "error")     setToast("Reddit connection failed. Try again.");

    fetch("/api/usage")
      .then((r) => r.json())
      .then(setUsage)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  function usagePct(used: number, max: number | null) {
    if (!max) return 0;
    return Math.min(100, Math.round((used / max) * 100));
  }

  const plan = usage?.plan ?? "free";

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar breadcrumb={["Account"]} title="Settings" />

      {toast && (
        <div className="mx-4 sm:mx-6 mt-4 px-4 py-3 border rounded-sm text-sm"
          style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)", color: "#17120C" }}>
          {toast}
        </div>
      )}

      <main className="flex-1 p-4 sm:p-6 space-y-8 max-w-2xl">

        {/* Plan */}
        <div>
          <SectionLabel className="mb-4">Plan &amp; usage</SectionLabel>
          <div className="border rounded-sm p-5" style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-base font-bold"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
                  {PLAN_LABELS[plan]} — {PLAN_PRICES[plan]}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#8A8071" }}>
                  Resets on the 1st of each month
                </p>
              </div>
              {plan === "free" && (
                <a href="#upgrade"
                  className="text-xs font-semibold px-4 py-2 rounded-sm border shadow-hard-sm whitespace-nowrap"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", background: "#F23005", color: "#EFE7D6", borderColor: "#F23005" }}>
                  Upgrade to Starter — £15/mo
                </a>
              )}
            </div>

            <div className="space-y-3.5">
              {usage && [
                { label: "Reddit posts", used: usage.usage.posts,   max: usage.limits.postsPerMonth,   unit: "/mo" },
                { label: "SEO audits",   used: usage.usage.audits,  max: usage.limits.auditsPerMonth,  unit: "/mo" },
                { label: "Projects",     used: usage.usage.projects, max: usage.limits.projects,        unit: "" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs" style={{ color: "#5C5346" }}>{row.label}</span>
                    <span className="text-[0.65rem]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
                      {row.used} / {row.max ?? "∞"}{row.unit}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(23,18,12,0.10)" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${row.max ? usagePct(row.used, row.max) : 5}%`,
                        background: row.max && row.used >= row.max ? "#F23005" : "#17120C",
                      }} />
                  </div>
                </div>
              ))}
              {!usage && (
                <div className="space-y-3">
                  {[1,2,3].map((i) => <div key={i} className="h-6 rounded-sm animate-pulse" style={{ background: "rgba(23,18,12,0.06)" }} />)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing tiers */}
        <div id="upgrade">
          <SectionLabel className="mb-4">Plans</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              { key: "free",    label: "Free",    price: "£0",    posts: "10 drafts/mo", audits: "1 audit", channels: "2", approval: "Required" },
              { key: "starter", label: "Starter", price: "£15/mo", posts: "50/mo, auto", audits: "Weekly",  channels: "4", approval: "Required" },
              { key: "pro",     label: "Pro",     price: "£49/mo", posts: "Unlimited",   audits: "Real-time", channels: "All", approval: "Optional" },
            ] as const).map((tier) => (
              <div key={tier.key}
                className="border rounded-sm p-4 flex flex-col"
                style={{
                  background: tier.key === plan ? "#17120C" : "#F4EEE0",
                  borderColor: tier.key === plan ? "#17120C" : "rgba(23,18,12,0.14)",
                }}>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] mb-1"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", color: tier.key === plan ? "#8A8071" : "#8A8071" }}>
                  {tier.label}
                </p>
                <p className="text-2xl font-bold tracking-[-0.02em] mb-3"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif", color: tier.key === plan ? "#EFE7D6" : "#17120C" }}>
                  {tier.price}
                </p>
                <ul className="space-y-1 text-xs flex-1 mb-4" style={{ color: tier.key === plan ? "#8A8071" : "#5C5346" }}>
                  <li>{tier.posts}</li>
                  <li>{tier.audits}</li>
                  <li>{tier.channels} channels</li>
                  <li>Approval: {tier.approval}</li>
                </ul>
                {tier.key !== plan && tier.key !== "free" && (
                  <button className="text-xs font-semibold px-3 py-2 border rounded-sm"
                    style={{ fontFamily: "var(--font-jetbrains), monospace", background: "#17120C", color: "#EFE7D6", borderColor: "#17120C" }}>
                    Upgrade →
                  </button>
                )}
                {tier.key === plan && (
                  <span className="text-[0.65rem] uppercase tracking-[0.08em]"
                    style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#5C5346" }}>
                    Current plan
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Connected channels */}
        <div>
          <SectionLabel className="mb-4">Connected channels</SectionLabel>
          <div className="border rounded-sm overflow-hidden" style={{ borderColor: "rgba(23,18,12,0.14)" }}>
            {CHANNELS.map((ch, i) => {
              const connected = ch.key === "reddit" && !!username;
              return (
                <div key={ch.key}
                  className="flex items-center gap-4 px-5 py-4 border-b last:border-0"
                  style={{ background: i % 2 === 0 ? "#F4EEE0" : "#EFE7D6", borderColor: "rgba(23,18,12,0.10)" }}>
                  <span className="text-base w-5 shrink-0 text-center"
                    style={{ fontFamily: "var(--font-jetbrains), monospace", color: connected ? "#3E8E4F" : "#8A8071" }}>
                    {ch.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
                      {ch.name}
                    </p>
                    {connected && (
                      <p className="text-[0.65rem] mt-0.5"
                        style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
                        u/{username}
                      </p>
                    )}
                  </div>
                  {"pro" in ch && ch.pro && plan === "free" ? (
                    <span className="text-[0.65rem] px-2 py-0.5 border rounded-sm uppercase tracking-[0.08em]"
                      style={{ fontFamily: "var(--font-jetbrains), monospace", borderColor: "#17120C", color: "#17120C" }}>
                      Pro
                    </span>
                  ) : connected ? (
                    <span className="text-[0.65rem] uppercase tracking-[0.08em]"
                      style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#3E8E4F" }}>
                      Connected
                    </span>
                  ) : (
                    <a href={ch.key === "reddit" ? "/api/reddit/oauth/connect" : "#upgrade"}
                      className="text-xs font-medium px-3 py-1.5 border rounded-sm"
                      style={{ fontFamily: "var(--font-jetbrains), monospace", borderColor: "rgba(23,18,12,0.20)", color: "#5C5346" }}>
                      Connect
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <SectionLabel className="mb-4">Danger zone</SectionLabel>
          <div className="border rounded-sm p-5" style={{ background: "#F4EEE0", borderColor: "rgba(242,48,5,0.20)" }}>
            <p className="text-sm font-semibold mb-1" style={{ color: "#17120C" }}>Delete project</p>
            <p className="text-xs mb-4" style={{ color: "#5C5346" }}>
              Permanently delete this project and all associated posts, audits, and data. This cannot be undone.
            </p>
            <button
              onClick={() => {
                if (!window.confirm("Delete this project? This cannot be undone.")) return;
                setDeleting(true);
                // TODO: call DELETE /api/projects once auth is wired
                setTimeout(() => { document.cookie = "currentProjectId=; max-age=0; path=/"; window.location.href = "/onboarding"; }, 500);
              }}
              disabled={deleting}
              className="text-xs font-semibold px-3 py-1.5 border rounded-sm"
              style={{ fontFamily: "var(--font-jetbrains), monospace", borderColor: "#F23005", color: "#F23005", opacity: deleting ? 0.5 : 1 }}>
              {deleting ? "Deleting..." : "Delete project"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
