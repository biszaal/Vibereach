"use client";

const data = [
  { day: "May 1",  reach: 120 },
  { day: "May 4",  reach: 245 },
  { day: "May 7",  reach: 198 },
  { day: "May 10", reach: 380 },
  { day: "May 13", reach: 290 },
  { day: "May 16", reach: 520 },
  { day: "May 19", reach: 445 },
  { day: "May 22", reach: 680 },
  { day: "May 25", reach: 590 },
  { day: "May 28", reach: 820 },
  { day: "May 31", reach: 920 },
];

export function ReachChart() {
  const W = 600;
  const H = 180;
  const pad = { top: 10, right: 12, bottom: 28, left: 36 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const maxReach = Math.max(...data.map((d) => d.reach));
  const xs = data.map((_, i) => pad.left + (i / (data.length - 1)) * innerW);
  const ys = data.map((d) => pad.top + innerH - (d.reach / maxReach) * innerH);

  const linePath = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${xs[xs.length - 1]} ${pad.top + innerH}` +
    ` L ${xs[0]} ${pad.top + innerH} Z`;

  const yLabels = [0, Math.round(maxReach / 2), maxReach];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: "180px" }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#17120C" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#17120C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yLabels.map((v, i) => {
          const y = pad.top + innerH - (v / maxReach) * innerH;
          return (
            <g key={i}>
              <line
                x1={pad.left}
                x2={pad.left + innerW}
                y1={y}
                y2={y}
                stroke="rgba(23,18,12,0.08)"
                strokeWidth={1}
              />
              <text
                x={pad.left - 6}
                y={y + 4}
                textAnchor="end"
                fill="#8A8071"
                fontSize={9}
                fontFamily="var(--font-jetbrains), monospace"
              >
                {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
              </text>
            </g>
          );
        })}

        {/* X axis labels (sparse) */}
        {data
          .filter((_, i) => i % 3 === 0)
          .map((d, i) => {
            const idx = i * 3;
            return (
              <text
                key={i}
                x={xs[idx]}
                y={H - 4}
                textAnchor="middle"
                fill="#8A8071"
                fontSize={8}
                fontFamily="var(--font-jetbrains), monospace"
              >
                {d.day.split(" ")[1]}
              </text>
            );
          })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#area-fill)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#17120C"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {xs.map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={ys[i]}
            r={3}
            fill="#EFE7D6"
            stroke="#17120C"
            strokeWidth={1.5}
          />
        ))}

        {/* Vermilion highlight on peak */}
        <circle
          cx={xs[data.length - 1]}
          cy={ys[data.length - 1]}
          r={4}
          fill="#F23005"
          stroke="#EFE7D6"
          strokeWidth={1.5}
        />
      </svg>
    </div>
  );
}
