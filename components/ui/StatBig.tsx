"use client";

interface StatBigProps {
  value: string;
  label: string;
  sub?: string;
  delta?: string;
  deltaPositive?: boolean;
}

export function StatBig({ value, label, sub, delta, deltaPositive }: StatBigProps) {
  return (
    <div
      className="relative overflow-hidden rounded-sm p-5 sm:p-8 glow-vermilion"
      style={{ background: "#17120C" }}
    >
      {/* Radial glow handled by CSS .glow-vermilion::before */}
      <div className="relative z-10">
        <p
          className="text-[0.68rem] font-medium uppercase tracking-[0.12em] mb-4"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#5C5346" }}
        >
          {label}
        </p>
        <p
          className="text-5xl sm:text-7xl font-bold leading-none tracking-[-0.03em] mb-3"
          style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#EFE7D6" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-sm" style={{ color: "#8A8071" }}>
            {sub}
          </p>
        )}
        {delta && (
          <p
            className="mt-2 text-xs font-medium"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              color: deltaPositive ? "#3E8E4F" : "#F23005",
            }}
          >
            {delta}
          </p>
        )}
      </div>
    </div>
  );
}
