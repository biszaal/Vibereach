"use client";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export function SectionLabel({ children, className = "", light = false }: SectionLabelProps) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      style={{ fontFamily: "var(--font-jetbrains), monospace" }}
    >
      <span
        className="block h-px w-8 shrink-0"
        style={{ background: light ? "rgba(239,231,214,0.35)" : "rgba(23,18,12,0.30)" }}
      />
      <span
        className="text-[0.68rem] font-medium uppercase tracking-[0.12em]"
        style={{ color: light ? "#8A8071" : "#8A8071" }}
      >
        {children}
      </span>
    </div>
  );
}
