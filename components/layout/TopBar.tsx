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
      className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b"
      style={{
        background: "#EFE7D6",
        borderColor: "rgba(23,18,12,0.14)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggle}
          className="md:hidden flex flex-col gap-1 p-1 shrink-0"
          aria-label="Open menu"
        >
          <span className="block w-4 h-px" style={{ background: "#17120C" }} />
          <span className="block w-4 h-px" style={{ background: "#17120C" }} />
          <span className="block w-3 h-px" style={{ background: "#17120C" }} />
        </button>

        <div className="flex items-center gap-1.5 min-w-0">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs hidden sm:inline" style={{ color: "#8A8071" }}>
                {crumb}
              </span>
              <span className="hidden sm:inline" style={{ color: "#8A8071" }}>›</span>
            </span>
          ))}
          <h1
            className="text-sm font-semibold truncate"
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              color: "#17120C",
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Right */}
      {actions && <div className="flex items-center gap-2 shrink-0 ml-3">{actions}</div>}
    </header>
  );
}
