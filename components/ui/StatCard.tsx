"use client";

interface StatCardProps {
  value: string | number;
  label: string;
  sub?: string;
  delta?: string;
  deltaPositive?: boolean;
  accent?: boolean;
  className?: string;
}

export function StatCard({
  value,
  label,
  sub,
  delta,
  deltaPositive,
  accent = false,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`border rounded-sm p-5 ${className}`}
      style={{
        background: "#F4EEE0",
        borderColor: "rgba(23,18,12,0.14)",
      }}
    >
      <p
        className="text-[0.65rem] font-medium uppercase tracking-[0.12em] mb-3"
        style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
      >
        {label}
      </p>
      <p
        className="text-4xl font-bold leading-none tracking-[-0.025em] mb-1"
        style={{
          fontFamily: "var(--font-bricolage), sans-serif",
          color: accent ? "#F23005" : "#17120C",
        }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: "#8A8071" }}>
          {sub}
        </p>
      )}
      {delta && (
        <p
          className="mt-2 text-[0.65rem] font-medium"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            color: deltaPositive ? "#3E8E4F" : "#F23005",
          }}
        >
          {delta}
        </p>
      )}
    </div>
  );
}
