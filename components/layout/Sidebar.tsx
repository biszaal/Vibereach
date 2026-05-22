"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard",       label: "Dashboard",     icon: "◈" },
      { href: "/playbook",        label: "Playbook",      icon: "◉" },
    ],
  },
  {
    label: "Engines",
    items: [
      { href: "/reddit",          label: "Reddit Engine", icon: "▣" },
      { href: "/audit",           label: "SEO Audit",     icon: "◎" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/settings",        label: "Settings",      icon: "◇" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-56 flex flex-col border-r z-40"
      style={{
        background: "#EFE7D6",
        borderColor: "rgba(23,18,12,0.14)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 py-5 border-b"
        style={{ borderColor: "rgba(23,18,12,0.14)" }}
      >
        <span
          className="w-6 h-6 flex items-center justify-center rounded-sm text-xs font-bold"
          style={{ background: "#17120C", color: "#EFE7D6" }}
        >
          V
        </span>
        <span
          className="text-base font-bold tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
        >
          VibeReach
        </span>
      </div>

      {/* Project switcher */}
      <div
        className="mx-3 mt-4 mb-1 px-3 py-2.5 border rounded-sm cursor-pointer flex items-center justify-between group"
        style={{
          background: "#F4EEE0",
          borderColor: "rgba(23,18,12,0.14)",
        }}
      >
        <div className="min-w-0">
          <p
            className="text-[0.6rem] uppercase tracking-[0.1em] mb-0.5"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
          >
            Project
          </p>
          <p
            className="text-xs font-semibold truncate"
            style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
          >
            My First Project
          </p>
        </div>
        <span className="text-[#8A8071] text-xs ml-2 shrink-0">⌄</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pt-3 pb-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              className="px-2 mb-1.5 text-[0.6rem] uppercase tracking-[0.12em]"
              style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
            >
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-sm font-medium transition-colors"
                      style={{
                        fontFamily: "var(--font-hanken), sans-serif",
                        background: active ? "rgba(23,18,12,0.08)" : "transparent",
                        color: active ? "#17120C" : "#5C5346",
                        borderLeft: active ? "2px solid #F23005" : "2px solid transparent",
                      }}
                    >
                      <span
                        className="text-[0.75rem] w-4 shrink-0"
                        style={{
                          fontFamily: "var(--font-jetbrains), monospace",
                          color: active ? "#F23005" : "#8A8071",
                        }}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Plan / usage card */}
      <div
        className="mx-3 mb-3 p-3 border rounded-sm"
        style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[0.6rem] uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
          >
            Free Plan
          </span>
          <Link
            href="/settings"
            className="text-[0.62rem] font-semibold"
            style={{ color: "#F23005", fontFamily: "var(--font-jetbrains), monospace" }}
          >
            Upgrade
          </Link>
        </div>
        <div className="space-y-1.5">
          {[
            { label: "Posts", used: 3, max: 10 },
            { label: "Audits", used: 1, max: 1 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-0.5">
                <span
                  className="text-[0.58rem] uppercase tracking-[0.08em]"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
                >
                  {item.label}
                </span>
                <span
                  className="text-[0.58rem]"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
                >
                  {item.used}/{item.max}
                </span>
              </div>
              <div
                className="h-1 w-full rounded-full overflow-hidden"
                style={{ background: "rgba(23,18,12,0.10)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(item.used / item.max) * 100}%`,
                    background: item.used >= item.max ? "#F23005" : "#17120C",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User row */}
      <div
        className="flex items-center gap-2.5 px-4 py-3.5 border-t"
        style={{ borderColor: "rgba(23,18,12,0.14)" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: "#17120C", color: "#EFE7D6" }}
        >
          B
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-xs font-semibold truncate leading-tight"
            style={{ color: "#17120C" }}
          >
            biszaal
          </p>
          <p
            className="text-[0.6rem] truncate"
            style={{ color: "#8A8071" }}
          >
            biszaal@gmail.com
          </p>
        </div>
      </div>
    </aside>
  );
}
