"use client";

import { useEffect, useRef, useState } from "react";

interface ScoreWheelProps {
  score: number;
  size?: number;
  label?: string;
}

export function ScoreWheel({ score, size = 120, label = "SEO Score" }: ScoreWheelProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<SVGCircleElement>(null);

  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? "#3E8E4F" : score >= 50 ? "#F23005" : "#C92704";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(23,18,12,0.10)"
          strokeWidth={10}
        />
        {/* Arc */}
        <circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? targetOffset : circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: animated ? "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" : "none",
          }}
        />
        {/* Score text */}
        <text
          x={size / 2}
          y={size / 2 + 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#17120C"
          fontSize={size * 0.22}
          fontWeight="700"
          fontFamily="var(--font-bricolage), sans-serif"
          letterSpacing="-0.03em"
        >
          {score}
        </text>
      </svg>
      {label && (
        <p
          className="text-[0.65rem] uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
        >
          {label}
        </p>
      )}
    </div>
  );
}
