"use client";

interface TopBarProps {
  breadcrumb?: string[];
  title: string;
  actions?: React.ReactNode;
}

export function TopBar({ breadcrumb = [], title, actions }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 border-b"
      style={{
        background: "#EFE7D6",
        borderColor: "rgba(23,18,12,0.14)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Left: breadcrumb + title */}
      <div className="flex items-center gap-2">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <span
              className="text-xs"
              style={{ color: "#8A8071" }}
            >
              {crumb}
            </span>
            <span style={{ color: "#8A8071" }}>›</span>
          </span>
        ))}
        <h1
          className="text-sm font-semibold"
          style={{
            fontFamily: "var(--font-bricolage), sans-serif",
            color: "#17120C",
          }}
        >
          {title}
        </h1>
      </div>

      {/* Right: actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
