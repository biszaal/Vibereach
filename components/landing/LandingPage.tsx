"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Ticker } from "@/components/ui/Ticker";

// ── Helpers ──────────────────────────────────────────────────────────────────

function useScrolled(threshold = 30) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

function Reveal({ children, className = "", style, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function LandingNav() {
  const scrolled = useScrolled();
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(239,231,214,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(23,18,12,0.14)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex items-center justify-between h-[72px]">
        <div className="flex items-center gap-2 font-extrabold tracking-[-0.02em]" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "22px", color: "#17120C" }}>
          VibeReach
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F23005" }} />
        </div>
        <div className="hidden md:flex items-center gap-7">
          {[["The problem", "#problem"], ["How it works", "#how"], ["Pricing", "#pricing"]].map(([label, href]) => (
            <a key={label} href={href} className="text-sm font-medium transition-colors" style={{ color: "#17120C" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F23005")}
              onMouseLeave={e => (e.currentTarget.style.color = "#17120C")}
            >
              {label}
            </a>
          ))}
          <Link
            href="/waitlist"
            className="text-[0.7rem] font-bold px-5 py-2.5 rounded-sm transition-all"
            style={{ fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "0.1em", textTransform: "uppercase", background: "#17120C", color: "#EFE7D6" }}
          >
            Start free
          </Link>
        </div>
        <Link
          href="/waitlist"
          className="md:hidden text-[0.7rem] font-bold px-4 py-2 rounded-sm"
          style={{ fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "0.08em", textTransform: "uppercase", background: "#17120C", color: "#EFE7D6" }}
        >
          Join →
        </Link>
      </div>
    </nav>
  );
}

// ── Hero reddit card ──────────────────────────────────────────────────────────

const CARD_TITLE = "I built a finance app in 9 days. Roast my landing page?";
const CARD_BODY = "Solo dev here. Spent way longer on the AWS backend than I'd like to admit, and now the marketing side is kicking my teeth in. Before I throw money at ads — what's the first thing you'd change?";

function HeroCard() {
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [titleDone, setTitleDone] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    function typeTitle() {
      if (cancelled) return;
      if (i <= CARD_TITLE.length) { setTitleText(CARD_TITLE.slice(0, i++)); setTimeout(typeTitle, 34); }
      else { setTitleDone(true); let j = 0; typeBody(); function typeBody() { if (cancelled) return; if (j <= CARD_BODY.length) { setBodyText(CARD_BODY.slice(0, j++)); setTimeout(typeBody, 16); } } }
    }
    const t = setTimeout(typeTitle, 800);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  return (
    <div
      className="border rounded-sm overflow-hidden"
      style={{
        background: "#EFE7D6", borderColor: "#17120C",
        boxShadow: "10px 12px 0 rgba(23,18,12,0.12)",
        transform: hovered ? "rotate(0deg) translateY(-4px)" : "rotate(1.4deg)",
        transition: "transform 0.4s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ background: "#E6DCC6", borderColor: "rgba(23,18,12,0.14)" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F23005" }} />
        <span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: "#17120C" }} />
        <span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: "#17120C" }} />
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#F23005" }} />
          <span className="text-[0.6rem] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>Writing now</span>
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#F23005", color: "#EFE7D6", fontFamily: "var(--font-bricolage), sans-serif" }}>r</div>
          <span className="text-xs" style={{ fontFamily: "var(--font-hanken), sans-serif", color: "#17120C" }}>
            <strong>r/SideProject</strong> <span style={{ color: "#8A8071" }}>· posted by VibeReach</span>
          </span>
        </div>
        <h3 className="font-bold leading-snug mb-2.5" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "17px", letterSpacing: "-0.01em", color: "#17120C" }}>
          {titleText}
          {!titleDone && <span className="inline-block w-2 h-4 ml-px align-[-2px] animate-pulse" style={{ background: "#F23005" }} />}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#17120C", minHeight: "96px" }}>
          {bodyText}
          {titleDone && bodyText.length < CARD_BODY.length && (
            <span className="inline-block w-2 h-4 ml-px align-[-2px] animate-pulse" style={{ background: "#F23005" }} />
          )}
        </p>
        <div className="flex items-center gap-5 mt-4 pt-3 border-t text-[0.65rem] uppercase tracking-[0.05em]" style={{ borderColor: "rgba(23,18,12,0.14)", fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
          <span style={{ color: "#F23005", fontWeight: 700 }}>▲ 247</span>
          <span>38 comments</span>
          <span>share</span>
        </div>
      </div>
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-8 h-px shrink-0" style={{ background: "#F23005" }} />
      <span className="text-[0.65rem] uppercase tracking-[0.16em]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}>{children}</span>
    </div>
  );
}

// ── Engine code visual ────────────────────────────────────────────────────────

const ENGINES = [
  {
    num: "01", title: "Analyse", tag: "The brain",
    body: "Paste a URL or repo. VibeReach reads your product, figures out who it's for, what pain it kills, and builds a marketing playbook — tone, audience, the exact subreddits worth your time.",
    code: [
      { c: "cm", v: "// building playbook…" },
      { c: "g",  v: 'audience: "indie devs shipping with AI"' },
      { c: "g",  v: 'pain: "can build, can\'t market"' },
      { c: "o",  v: 'voice: "builder, not marketer"' },
      { c: "b",  v: "targets: [r/SideProject, r/webdev]" },
    ],
  },
  {
    num: "02", title: "Post", tag: "The publisher",
    body: "Native-feeling Reddit posts, X threads, and warm cold emails — drip-scheduled so you never trip a spam filter. You approve, it ships. Or hand it the keys and let it run.",
    code: [
      { c: "cm", v: "// queue · drip mode on" },
      { c: "g",  v: "✓ r/SideProject   posted · 247▲" },
      { c: "o",  v: "→ r/webdev        in 2h 14m" },
      { c: "o",  v: "→ cold email #3   tomorrow 9am" },
    ],
  },
  {
    num: "03", title: "Improve", tag: "The consultant",
    body: "A growth advisor that never logs off. It audits your page for SEO and conversion, rewrites weak copy, and flags the features your competitors have that you don't — every week.",
    code: [
      { c: "cm", v: "// weekly audit" },
      { c: "o",  v: "score: 68 → 81" },
      { c: "g",  v: "fix: move signup above fold" },
      { c: "g",  v: "fix: headline = outcome, not feature" },
      { c: "b",  v: "add: social proof near CTA" },
    ],
  },
];

const CODE_COLOR: Record<string, string> = {
  cm: "rgba(239,231,214,0.40)",
  g:  "#8DD68D",
  o:  "#F2A03D",
  b:  "#7FB3E8",
  d:  "#EFE7D6",
};

// ── Landing page ──────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "Posted to r/webdev", "Cold email opened", "SEO score +22",
  "Posted to r/indiehackers", "Show HN scheduled", "Headline rewritten",
];

export function LandingPage() {
  return (
    <div style={{ background: "#EFE7D6" }}>
      <div className="grain-overlay" />
      <LandingNav />

      {/* ── HERO ── */}
      <header className="pt-[130px] pb-14 sm:pt-[150px] sm:pb-20">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left */}
          <div>
            {/* Kicker */}
            <div className="inline-flex items-center gap-2.5 border rounded-full px-4 py-2 mb-7" style={{ borderColor: "rgba(23,18,12,0.28)", background: "rgba(255,255,255,0.22)" }}>
              <span className="relative flex-shrink-0">
                <span className="block w-2 h-2 rounded-full" style={{ background: "#F23005" }} />
                <span className="absolute inset-[-4px] rounded-full border animate-ping" style={{ borderColor: "#F23005", animationDuration: "2s" }} />
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.12em]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#17120C" }}>
                Marketing autopilot for builders
              </span>
            </div>

            {/* H1 */}
            <h1
              className="font-extrabold leading-[0.92] tracking-[-0.035em] mb-6"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(3rem, 7vw, 5.8rem)", color: "#17120C" }}
            >
              You <span style={{ color: "#F23005" }}>shipped</span>.
              <br />
              <span className="relative inline-block">
                Nobody came.
                <span
                  className="absolute block rounded-sm"
                  style={{
                    left: "-2%", right: "-2%", top: "58%", height: "5px",
                    background: "#F23005",
                    transform: "rotate(-2deg) scaleX(0)",
                    transformOrigin: "left",
                    animation: "strike 0.7s 0.9s cubic-bezier(0.7,0,0.3,1) forwards",
                  }}
                />
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-[440px]" style={{ color: "#5C5346" }}>
              You built the whole thing with Claude Code in a weekend. The marketing is the part nobody taught you.{" "}
              <strong style={{ color: "#17120C", fontWeight: 600 }}>VibeReach posts, emails, and tunes your launch</strong>{" "}
              like a growth hire who never sleeps.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link
                href="/waitlist"
                className="inline-flex items-center gap-2 text-[0.72rem] font-bold px-6 py-4 rounded-sm shadow-hard"
                style={{ fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "0.08em", textTransform: "uppercase", background: "#F23005", color: "#EFE7D6", border: "1px solid #17120C" }}
              >
                Connect your project →
              </Link>
              <a
                href="#demo"
                className="text-[0.72rem] font-bold px-6 py-4 border rounded-sm transition-colors"
                style={{ fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "0.08em", textTransform: "uppercase", borderColor: "rgba(23,18,12,0.28)", color: "#17120C" }}
              >
                See a live audit
              </a>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-7">
              {["No credit card", "10 free posts", "Built by a dev, for devs"].map((item) => (
                <span key={item} className="text-[0.65rem] uppercase tracking-[0.06em]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>{item}</span>
              ))}
            </div>
          </div>

          {/* Right — only on large screens */}
          <div className="hidden lg:block">
            <HeroCard />
          </div>
        </div>
      </header>

      {/* ── TICKER ── */}
      <Ticker items={TICKER_ITEMS} dark />

      {/* ── PROBLEM ── */}
      <section id="problem" className="py-24 sm:py-32 max-w-[1240px] mx-auto px-4 sm:px-8">
        <Reveal><SLabel>The honest truth</SLabel></Reveal>
        <Reveal delay={60}>
          <h2
            className="font-bold leading-[1.04] tracking-[-0.03em] max-w-3xl mb-16"
            style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(1.9rem, 4.5vw, 3.4rem)", color: "#17120C" }}
          >
            Building was the easy part. The market doesn&apos;t care how clean your code is — it cares whether it{" "}
            <em style={{ fontStyle: "italic", color: "#F23005", fontWeight: 600 }}>ever hears about you.</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 border-t" style={{ borderColor: "rgba(23,18,12,0.30)" }}>
          {[
            { num: "01 / The reflex",     title: "You post once, get three upvotes",  body: "One Reddit post. One tweet into the void. You give up by Tuesday and tell yourself it wasn't a good idea anyway." },
            { num: "02 / The blind spot", title: "Your landing page leaks visitors",  body: "The CTA is below the fold. The headline says what it does, not why it matters. Nobody tells you, so it quietly costs you signups." },
            { num: "03 / The wrong voice", title: "You sound like an ad",            body: "Every subreddit has its own culture. Post like a marketer and you get downvoted. Post like a builder and you get traction." },
            { num: "04 / The time tax",   title: "You'd rather be shipping",          body: "Cold email, SEO, content cadence, launch timing — it's a full-time job. So it never gets done, and the product stays invisible." },
          ].map((cell, i) => (
            <Reveal
              key={i}
              delay={i * 55}
              className={`py-8 ${i % 2 === 0 ? "sm:border-r sm:pr-12" : "sm:pl-12"}`}
              style={{ borderBottom: "1px solid rgba(23,18,12,0.14)", borderColor: "rgba(23,18,12,0.14)" }}
            >
              <p className="text-[0.63rem] uppercase tracking-[0.12em] mb-3.5" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>{cell.num}</p>
              <h3 className="font-bold mb-2" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "20px", letterSpacing: "-0.01em", color: "#17120C" }}>{cell.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#5C5346" }}>{cell.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ENGINES ── */}
      <section id="how" className="py-16 sm:py-24 max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5 mb-14">
          <Reveal>
            <h2 className="font-extrabold leading-[0.95] tracking-[-0.035em]" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(2rem, 5vw, 3.6rem)", color: "#17120C" }}>
              Three engines.<br />One quiet launch machine.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#5C5346" }}>
              Connect once. VibeReach learns your product, finds your people, and keeps the flywheel turning while you build.
            </p>
          </Reveal>
        </div>

        {ENGINES.map((engine, i) => (
          <Reveal key={i}>
            <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_1.1fr] gap-6 md:gap-10 items-center py-10 border-t last:border-b" style={{ borderColor: "rgba(23,18,12,0.28)" }}>
              <div className="font-extrabold leading-none" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(44px, 6vw, 64px)", color: "#EFE7D6", WebkitTextStroke: "1.4px #17120C" }}>
                {engine.num}
              </div>
              <div>
                <h3 className="font-bold mb-3" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(22px, 2.8vw, 30px)", letterSpacing: "-0.02em", color: "#17120C" }}>
                  {engine.title}{" "}
                  <span className="text-[0.65rem] uppercase tracking-[0.1em] border px-2 py-1 rounded-sm align-middle ml-2" style={{ fontFamily: "var(--font-jetbrains), monospace", borderColor: "#F23005", color: "#F23005" }}>
                    {engine.tag}
                  </span>
                </h3>
                <p className="text-sm leading-relaxed max-w-md" style={{ color: "#5C5346" }}>{engine.body}</p>
              </div>
              <div className="rounded-sm p-4 sm:p-5 text-xs leading-[1.9]" style={{ fontFamily: "var(--font-jetbrains), monospace", background: "#17120C", boxShadow: "6px 6px 0 rgba(23,18,12,0.13)" }}>
                {engine.code.map((line, j) => (
                  <div key={j} style={{ color: CODE_COLOR[line.c] ?? "#EFE7D6" }}>{line.v}</div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ── DEMO ── */}
      <section id="demo" className="py-24 relative overflow-hidden" style={{ background: "#17120C" }}>
        <div className="absolute top-[-30%] right-[-10%] w-[600px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(circle, #F23005 0%, transparent 65%)", opacity: 0.30 }} />
        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-8">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px shrink-0" style={{ background: "#F23005" }} />
              <span className="text-[0.65rem] uppercase tracking-[0.16em]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}>Seeing is believing</span>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-bold leading-[1.05] tracking-[-0.03em] max-w-3xl mb-12" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(1.7rem, 4vw, 3rem)", color: "#EFE7D6" }}>
              Drop your URL. Get a brutally honest{" "}
              <span style={{ textDecoration: "underline", textDecorationColor: "#F23005", textUnderlineOffset: "8px", textDecorationThickness: "3px" }}>
                audit in 30 seconds
              </span>
              {" "}— before you pay a thing.
            </h2>
          </Reveal>

          <div className="flex flex-col sm:flex-row gap-4">
            <Reveal className="flex-1">
              <div className="border rounded-sm p-6" style={{ background: "rgba(239,231,214,0.05)", borderColor: "rgba(239,231,214,0.15)" }}>
                <div className="flex items-baseline gap-2.5 mb-5">
                  <span className="font-extrabold leading-none" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "54px", color: "#F23005" }}>68</span>
                  <span className="text-sm" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "rgba(239,231,214,0.45)" }}>/ 100</span>
                  <span className="ml-auto text-[0.62rem] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "rgba(239,231,214,0.55)" }}>Conversion + SEO</span>
                </div>
                {[
                  { type: "FIX",  bold: "No H1 above the fold.",            rest: "Visitors don't know what you do in the first 3 seconds." },
                  { type: "FIX",  bold: "Meta description missing.",        rest: "Google is writing your search snippet for you. Badly." },
                  { type: "FIX",  bold: "CTA below the fold on mobile.",    rest: "60% of your traffic never sees the button." },
                  { type: "GOOD", bold: "Fast load (1.2s). Clean layout.",  rest: "Keep it." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 py-3.5 border-t items-start text-sm" style={{ borderColor: "rgba(239,231,214,0.12)" }}>
                    <span className="text-[0.62rem] font-bold shrink-0 mt-0.5" style={{ fontFamily: "var(--font-jetbrains), monospace", color: item.type === "GOOD" ? "#8DD68D" : "#F23005" }}>{item.type}</span>
                    <span style={{ color: "rgba(239,231,214,0.80)", lineHeight: 1.45 }}>
                      <strong style={{ color: "#EFE7D6" }}>{item.bold}</strong> {item.rest}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120} className="sm:w-[300px] shrink-0">
              <div className="border rounded-sm p-6 h-full" style={{ background: "rgba(239,231,214,0.05)", borderColor: "rgba(239,231,214,0.15)" }}>
                <div className="text-[0.62rem] uppercase tracking-[0.1em] mb-5" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "rgba(239,231,214,0.55)" }}>Suggested rewrite</div>
                <div className="text-[0.62rem] uppercase tracking-[0.1em] mb-1.5" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "rgba(239,231,214,0.40)" }}>Your headline</div>
                <div className="text-sm mb-6 line-through" style={{ color: "rgba(239,231,214,0.55)", lineHeight: 1.4 }}>&quot;An AI-powered analytics dashboard platform&quot;</div>
                <div className="text-[0.62rem] uppercase tracking-[0.1em] mb-2" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}>VibeReach suggests</div>
                <div className="font-bold leading-snug" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "20px", color: "#EFE7D6" }}>
                  &quot;Know why your users churn — before they do.&quot;
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 sm:py-32 max-w-[1240px] mx-auto px-4 sm:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="font-extrabold leading-none tracking-[-0.035em] mb-4" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(2rem, 5vw, 3.8rem)", color: "#17120C" }}>
              Priced like an indie hacker built it
            </h2>
            <p className="text-base" style={{ color: "#5C5346" }}>Because one did. Start free, upgrade when it&apos;s working.</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 border" style={{ borderColor: "#17120C" }}>
            {([
              { name: "Free",    price: "£0",  period: "/forever", tag: null,          feat: false, desc: "Prove it works on one project.",               features: ["1 project", "10 Reddit drafts / month", "1 full SEO + copy audit", "Manual posting"],                                        cta: "Start free" },
              { name: "Starter", price: "£15", period: "/month",   tag: "Most picked", feat: true,  desc: "For the launch that needs momentum.",          features: ["3 projects", "50 auto-scheduled posts / mo", "100 cold emails / mo", "Reddit auto-posting", "Weekly audits + rewrites"],   cta: "Start 14-day trial" },
              { name: "Pro",     price: "£49", period: "/month",   tag: null,          feat: false, desc: "Full autopilot across every channel.",          features: ["Unlimited projects", "Unlimited posts, all channels", "1,000 cold emails / mo", "Hands-off autopilot mode", "Real-time recommendations"], cta: "Go Pro" },
            ] as const).map((plan, i) => (
              <div
                key={i}
                className="p-7 sm:p-8 relative"
                style={{
                  background: plan.feat ? "#17120C" : "#EFE7D6",
                  borderRight: i < 2 ? "1px solid rgba(23,18,12,0.28)" : "none",
                }}
              >
                {plan.tag && (
                  <div className="absolute top-0 right-0 text-[0.6rem] font-bold uppercase tracking-[0.1em] px-3 py-1.5" style={{ fontFamily: "var(--font-jetbrains), monospace", background: "#F23005", color: "#EFE7D6" }}>
                    {plan.tag}
                  </div>
                )}
                <div className="text-[0.7rem] uppercase tracking-[0.12em] mb-5" style={{ fontFamily: "var(--font-jetbrains), monospace", color: plan.feat ? "#F23005" : "#8A8071" }}>{plan.name}</div>
                <div className="font-extrabold leading-none tracking-[-0.03em] mb-3" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(2.8rem,5vw,3.4rem)", color: plan.feat ? "#EFE7D6" : "#17120C" }}>
                  {plan.price}<span className="text-base font-medium" style={{ color: plan.feat ? "rgba(239,231,214,0.50)" : "#8A8071" }}>{plan.period}</span>
                </div>
                <p className="text-sm mb-6 min-h-[36px]" style={{ color: plan.feat ? "rgba(239,231,214,0.65)" : "#5C5346" }}>{plan.desc}</p>
                <ul className="mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 py-2.5 border-t text-sm" style={{ borderColor: plan.feat ? "rgba(239,231,214,0.13)" : "rgba(23,18,12,0.13)", color: plan.feat ? "rgba(239,231,214,0.80)" : "#5C5346" }}>
                      <span className="font-bold shrink-0 text-[0.65rem]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}>+</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/waitlist"
                  className="block w-full text-center text-[0.7rem] font-bold py-3.5 border rounded-sm transition-all"
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "0.08em", textTransform: "uppercase",
                    background: plan.feat ? "#F23005" : "transparent",
                    borderColor: plan.feat ? "#F23005" : "#17120C",
                    color: plan.feat ? "#EFE7D6" : "#17120C",
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── FOUNDER ── */}
      <section className="pb-24 max-w-[1240px] mx-auto px-4 sm:px-8">
        <Reveal>
          <div className="border rounded-sm p-8 sm:p-14 relative overflow-hidden" style={{ background: "#E6DCC6", borderColor: "#17120C" }}>
            <div className="absolute top-[-30px] right-8 pointer-events-none select-none" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(120px,18vw,240px)", color: "#F23005", opacity: 0.10, lineHeight: 1 }}>&quot;</div>
            <SLabel>From the builder</SLabel>
            <blockquote className="font-semibold leading-[1.18] tracking-[-0.02em] max-w-3xl relative z-10 mb-8" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: "clamp(1.3rem, 3vw, 2.1rem)", color: "#17120C" }}>
              I shipped good products into total silence more times than I&apos;ll admit. VibeReach is the growth hire I couldn&apos;t afford —{" "}
              <em style={{ fontStyle: "italic", color: "#F23005" }}>so I built it instead.</em>
            </blockquote>
            <div className="flex items-center gap-3.5 mb-10">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-lg shrink-0" style={{ background: "#F23005", color: "#EFE7D6", fontFamily: "var(--font-bricolage), sans-serif" }}>B</div>
              <div>
                <div className="font-semibold text-sm" style={{ color: "#17120C" }}>Bishal</div>
                <div className="text-[0.63rem] uppercase tracking-[0.04em]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>solo dev · founder, VibeReach</div>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link href="/waitlist" className="inline-flex items-center gap-2 text-[0.7rem] font-bold px-6 py-4 rounded-sm shadow-hard" style={{ fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "0.08em", textTransform: "uppercase", background: "#F23005", color: "#EFE7D6", border: "1px solid #17120C" }}>
                Connect your project →
              </Link>
              <Link href="/waitlist" className="text-[0.7rem] font-bold px-6 py-4 border rounded-sm" style={{ fontFamily: "var(--font-jetbrains), monospace", letterSpacing: "0.08em", textTransform: "uppercase", borderColor: "rgba(23,18,12,0.28)", color: "#17120C" }}>
                Run a free audit
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t py-12" style={{ borderColor: "#17120C" }}>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 font-extrabold text-xl mb-3" style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
                VibeReach <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F23005" }} />
              </div>
              <p className="text-sm max-w-[220px]" style={{ color: "#5C5346" }}>Marketing autopilot for people who&apos;d rather be building.</p>
            </div>
            <div className="flex gap-10 sm:gap-16 flex-wrap">
              {[
                { title: "Product",  links: [["How it works", "#how"],    ["Pricing", "#pricing"],  ["Free audit",  "/waitlist"]] },
                { title: "Channels", links: [["Reddit",       "/waitlist"], ["Cold email", "/waitlist"], ["SEO",    "/waitlist"]] },
                { title: "Company",  links: [["Story",        "#"],         ["Changelog",  "#"],     ["Contact", "#"]] },
              ].map((col) => (
                <div key={col.title}>
                  <div className="text-[0.63rem] uppercase tracking-[0.12em] mb-3.5" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>{col.title}</div>
                  {col.links.map(([label, href]) => (
                    <a key={label} href={href} className="block text-sm mb-2 transition-colors hover:text-[#F23005]" style={{ color: "#17120C" }}>{label}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t text-[0.63rem] uppercase tracking-[0.04em]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071", borderColor: "rgba(23,18,12,0.14)" }}>
            <span>© 2026 VibeReach</span>
            <span>Built loud, shipped louder.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
