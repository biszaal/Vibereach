"use client";

interface TickerProps {
  items: string[];
  className?: string;
  dark?: boolean;
}

export function Ticker({ items, className = "", dark = false }: TickerProps) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`overflow-hidden border-y py-2.5 ${
        dark
          ? "border-[rgba(239,231,214,0.12)] bg-[#17120C]"
          : "border-[rgba(23,18,12,0.14)] bg-[#E6DCC6]"
      } ${className}`}
    >
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-4 px-6 text-[0.68rem] font-medium uppercase tracking-[0.12em] ${
              dark ? "text-[#8A8071]" : "text-[#5C5346]"
            }`}
            style={{ fontFamily: "var(--font-jetbrains), monospace" }}
          >
            {item}
            <span
              className={`w-1 h-1 rounded-full ${dark ? "bg-[#F23005]" : "bg-[#17120C]"}`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
