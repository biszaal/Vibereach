"use client";

import { useSidebar } from "./SidebarContext";

interface TopBarProps {
  breadcrumb?: string[];
  title: string;
  actions?: React.ReactNode;
}

export function TopBar({ breadcrumb = [], title, actions }: TopBarProps) {
  const { toggle } = useSidebar();

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-0 border-b"
      style={{ background: "#EFE7D6", borderColor: "rgba(23,18,12,0.14)", minHeight: "52px" }}
    >
      {/* Left */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Hamburger — 44×44px tap target, mobile only */}
        <button
          onClick={toggle}
          className="touch-target md:hidden shrink-0 -ml-2"
          aria-label="Open menu"
        >
          <span className="flex flex-col gap-[5px]">
            <span className="block w-[18px] h-px rounded-full" style={{ background: "#17120C" }} />
            <span className="block w-[18px] h-px rounded-full" style={{ background: "#17120C" }} />
            <span className="block w-[12px] h-px rounded-full" style={{ background: "#17120C" }} />
          </span>
        </button>

        {/* Breadcrumb + title */}
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span className="text-xs" style={{ color: "#8A8071" }}>{crumb}</span>
              <span style={{ color: "#8A8071" }}>›</span>
            </span>
          ))}
          <h1
            className="text-sm font-semibold truncate"
            style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Right */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0 ml-3">{actions}</div>
      )}
    </header>
  );
}
