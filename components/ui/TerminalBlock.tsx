"use client";

interface TerminalBlockProps {
  lines: Array<{ text: string; type?: "comment" | "key" | "value" | "plain" }>;
  title?: string;
  className?: string;
}

const typeColor: Record<string, string> = {
  comment: "#5C5346",
  key:     "#EFE7D6",
  value:   "#F23005",
  plain:   "#8A8071",
};

export function TerminalBlock({ lines, title, className = "" }: TerminalBlockProps) {
  return (
    <div
      className={`rounded-sm border overflow-hidden ${className}`}
      style={{ background: "#17120C", borderColor: "rgba(23,18,12,0.30)" }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: "rgba(239,231,214,0.10)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F23005" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#5C5346" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#5C5346" }} />
        {title && (
          <span
            className="ml-2 text-[0.62rem] uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#5C5346" }}
          >
            {title}
          </span>
        )}
      </div>
      {/* Content */}
      <div className="px-5 py-4 space-y-0.5">
        {lines.map((line, i) => (
          <p
            key={i}
            className="text-[0.75rem] leading-5"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: typeColor[line.type ?? "plain"],
            }}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}
