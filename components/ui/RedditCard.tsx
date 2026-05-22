"use client";

import { useState } from "react";

interface RedditCardProps {
  subreddit: string;
  title: string;
  body: string;
  fitScore?: number;
  variant?: "founder-story" | "question-led" | "value-first";
  status?: "draft" | "scheduled" | "posted";
  onApprove?: () => void;
  onEdit?: () => void;
  upvotes?: number;
  signups?: number;
  className?: string;
}

const variantLabel: Record<string, string> = {
  "founder-story": "Founder Story",
  "question-led":  "Question Led",
  "value-first":   "Value First",
};

export function RedditCard({
  subreddit,
  title,
  body,
  fitScore = 0,
  variant = "value-first",
  status = "draft",
  onApprove,
  onEdit,
  upvotes,
  signups,
  className = "",
}: RedditCardProps) {
  const [expanded, setExpanded] = useState(false);

  const fitColor =
    fitScore >= 75 ? "#3E8E4F" : fitScore >= 50 ? "#F23005" : "#8A8071";

  return (
    <div
      className={`border rounded-sm overflow-hidden ${className}`}
      style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}
    >
      {/* Subreddit header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "rgba(23,18,12,0.10)", background: "#EFE7D6" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#17120C" }}
          >
            r/{subreddit}
          </span>
          <span
            className="text-[0.62rem] px-1.5 py-0.5 rounded-sm"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              background: "rgba(23,18,12,0.08)",
              color: "#5C5346",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {variantLabel[variant]}
          </span>
        </div>
        {/* Fit meter */}
        <div className="flex items-center gap-2">
          <span
            className="text-[0.62rem] uppercase tracking-[0.08em]"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
          >
            Fit
          </span>
          <div
            className="w-16 h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(23,18,12,0.12)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${fitScore}%`, background: fitColor }}
            />
          </div>
          <span
            className="text-[0.65rem] font-semibold w-7 text-right"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: fitColor }}
          >
            {fitScore}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4">
        <h3
          className="text-sm font-semibold leading-snug mb-2"
          style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}
        >
          {title}
        </h3>
        <p
          className={`text-sm leading-relaxed ${!expanded ? "line-clamp-3" : ""}`}
          style={{ color: "#5C5346" }}
        >
          {body}
        </p>
        {body.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-[0.72rem] underline"
            style={{ color: "#8A8071" }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Footer */}
      {status === "draft" && (
        <div
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: "rgba(23,18,12,0.10)" }}
        >
          <button
            onClick={onEdit}
            className="text-xs font-medium px-3 py-1.5 border rounded-sm transition-colors"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              borderColor: "rgba(23,18,12,0.20)",
              color: "#5C5346",
            }}
          >
            Edit
          </button>
          <button
            onClick={onApprove}
            className="text-xs font-semibold px-4 py-1.5 rounded-sm shadow-hard-sm"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              background: "#17120C",
              color: "#EFE7D6",
            }}
          >
            Approve
          </button>
        </div>
      )}

      {status === "posted" && upvotes !== undefined && (
        <div
          className="flex items-center gap-4 px-4 py-3 border-t"
          style={{ borderColor: "rgba(23,18,12,0.10)" }}
        >
          <span
            className="text-[0.65rem] uppercase tracking-[0.08em]"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}
          >
            {upvotes} upvotes
          </span>
          {signups !== undefined && (
            <span
              className="text-[0.65rem] uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#3E8E4F" }}
            >
              {signups} signups
            </span>
          )}
        </div>
      )}
    </div>
  );
}
