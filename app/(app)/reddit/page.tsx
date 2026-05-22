"use client";

import { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tag } from "@/components/ui/Tag";

// ── Types ──────────────────────────────────────────────────────────────────

type Variant = "founder-story" | "question-led" | "value-first";
type Status  = "draft" | "scheduled" | "posted" | "failed";

interface Post {
  postId: string;
  subreddit: string;
  title: string;
  body: string;
  variant: Variant;
  fitScore: number;
  status: Status;
  scheduledAt?: string;
  postedAt?: string;
  metrics?: { upvotes: number; comments: number; signups: number };
  createdAt: string;
}

const VARIANT_LABEL: Record<Variant, string> = {
  "founder-story": "Founder Story",
  "question-led":  "Question Led",
  "value-first":   "Value First",
};

const TABS = ["drafts", "scheduled", "posted"] as const;
type Tab = typeof TABS[number];

// ── Helpers ────────────────────────────────────────────────────────────────

function FitMeter({ score }: { score: number }) {
  const color = score >= 75 ? "#3E8E4F" : score >= 50 ? "#F23005" : "#8A8071";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(23,18,12,0.12)" }}>
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-[0.65rem] font-semibold" style={{ fontFamily: "var(--font-jetbrains), monospace", color }}>
        {score}
      </span>
    </div>
  );
}

// ── Draft card ─────────────────────────────────────────────────────────────

function DraftCard({
  post,
  onApprove,
  onEdit,
}: {
  post: Post;
  onApprove: (postId: string) => Promise<void>;
  onEdit: (postId: string, title: string, body: string) => Promise<void>;
}) {
  const [expanded,  setExpanded]  = useState(false);
  const [editing,   setEditing]   = useState(false);
  const [title,     setTitle]     = useState(post.title);
  const [body,      setBody]      = useState(post.body);
  const [approving, setApproving] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [approved,  setApproved]  = useState(false);

  async function handleApprove() {
    setApproving(true);
    await onApprove(post.postId);
    setApproved(true);
    setApproving(false);
  }

  async function handleSave() {
    setSaving(true);
    await onEdit(post.postId, title, body);
    setEditing(false);
    setSaving(false);
  }

  if (approved) {
    return (
      <div className="border rounded-sm px-4 py-3 flex items-center gap-3"
        style={{ background: "#F4EEE0", borderColor: "rgba(62,142,79,0.25)", borderLeft: "3px solid #3E8E4F" }}>
        <span style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#3E8E4F", fontSize: "0.7rem" }}>✓</span>
        <p className="text-xs" style={{ color: "#5C5346" }}>
          <strong style={{ color: "#17120C" }}>{post.title}</strong> — scheduled for r/{post.subreddit}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-sm overflow-hidden" style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b" style={{ background: "#EFE7D6", borderColor: "rgba(23,18,12,0.10)" }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
            style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#17120C" }}>
            r/{post.subreddit}
          </span>
          <span className="text-[0.6rem] px-1.5 py-0.5 rounded-sm uppercase tracking-[0.06em]"
            style={{ fontFamily: "var(--font-jetbrains), monospace", background: "rgba(23,18,12,0.08)", color: "#5C5346" }}>
            {VARIANT_LABEL[post.variant]}
          </span>
        </div>
        <FitMeter score={post.fitScore} />
      </div>

      {/* Body */}
      <div className="px-4 py-4">
        {editing ? (
          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border text-sm outline-none"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", background: "#EFE7D6", borderColor: "rgba(23,18,12,0.25)", color: "#17120C" }}
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border text-sm outline-none resize-y"
              style={{ fontFamily: "var(--font-hanken), sans-serif", background: "#EFE7D6", borderColor: "rgba(23,18,12,0.25)", color: "#5C5346" }}
            />
          </div>
        ) : (
          <>
            <h3 className="text-sm font-semibold leading-snug mb-2"
              style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
              {title}
            </h3>
            <p className={`text-sm leading-relaxed ${!expanded ? "line-clamp-3" : ""}`} style={{ color: "#5C5346" }}>
              {body}
            </p>
            {body.length > 220 && (
              <button onClick={() => setExpanded(!expanded)} className="mt-1 text-[0.72rem] underline" style={{ color: "#8A8071" }}>
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t gap-2" style={{ borderColor: "rgba(23,18,12,0.10)" }}>
        {editing ? (
          <>
            <button onClick={() => setEditing(false)} className="text-xs font-medium px-3 py-1.5 border rounded-sm"
              style={{ fontFamily: "var(--font-jetbrains), monospace", borderColor: "rgba(23,18,12,0.20)", color: "#5C5346" }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="text-xs font-semibold px-4 py-1.5 rounded-sm border"
              style={{ fontFamily: "var(--font-jetbrains), monospace", background: "#17120C", color: "#EFE7D6", borderColor: "#17120C", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="text-xs font-medium px-3 py-1.5 border rounded-sm"
              style={{ fontFamily: "var(--font-jetbrains), monospace", borderColor: "rgba(23,18,12,0.20)", color: "#5C5346" }}>
              Edit
            </button>
            <button onClick={handleApprove} disabled={approving} className="text-xs font-semibold px-4 py-1.5 rounded-sm border shadow-hard-sm"
              style={{ fontFamily: "var(--font-jetbrains), monospace", background: "#17120C", color: "#EFE7D6", borderColor: "#17120C", opacity: approving ? 0.6 : 1 }}>
              {approving ? "Scheduling..." : "Approve →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Generate drawer ────────────────────────────────────────────────────────

function GenerateDrawer({ onGenerated }: { onGenerated: (posts: Post[]) => void }) {
  const [open,       setOpen]       = useState(false);
  const [subreddit,  setSubreddit]  = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  async function generate() {
    const sub = subreddit.trim().replace(/^r\//, "");
    if (!sub) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reddit/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subreddit: sub }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? "Generation failed."); return; }
      onGenerated(data.posts ?? []);
      setOpen(false);
      setSubreddit("");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="text-xs font-semibold px-4 py-1.5 rounded-sm border shadow-hard-sm"
        style={{ fontFamily: "var(--font-jetbrains), monospace", background: "#17120C", color: "#EFE7D6", borderColor: "#17120C" }}>
        Generate more
      </button>
    );
  }

  return (
    <div className="border rounded-sm p-4 space-y-3" style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}>
      <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
        Generate posts for a subreddit
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center border flex-1"
          style={{ background: "#EFE7D6", borderColor: "rgba(23,18,12,0.25)" }}>
          <span className="pl-3 text-xs" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>r/</span>
          <input value={subreddit} onChange={(e) => setSubreddit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="indiehackers"
            className="flex-1 px-2 py-2.5 text-sm outline-none bg-transparent"
            style={{ fontFamily: "var(--font-hanken), sans-serif", color: "#17120C" }} />
        </div>
        <button onClick={generate} disabled={loading || !subreddit.trim()}
          className="text-xs font-semibold px-4 py-2.5 border rounded-sm shrink-0"
          style={{ fontFamily: "var(--font-jetbrains), monospace", background: "#17120C", color: "#EFE7D6", borderColor: "#17120C",
            opacity: loading || !subreddit.trim() ? 0.6 : 1 }}>
          {loading ? "Generating..." : "Generate →"}
        </button>
        <button onClick={() => setOpen(false)} className="text-xs px-3 py-2.5 border rounded-sm"
          style={{ fontFamily: "var(--font-jetbrains), monospace", borderColor: "rgba(23,18,12,0.20)", color: "#5C5346" }}>
          Cancel
        </button>
      </div>
      {error && <p className="text-xs" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#F23005" }}>{error}</p>}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function RedditPage() {
  const [tab,       setTab]       = useState<Tab>("drafts");
  const [posts,     setPosts]     = useState<Post[]>([]);
  const [loading,   setLoading]   = useState(true);

  const fetchPosts = useCallback(async (status: Tab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reddit/posts?status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts ?? []);
      }
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(tab); }, [tab, fetchPosts]);

  async function handleApprove(postId: string) {
    const post = posts.find((p) => p.postId === postId);
    await fetch(`/api/reddit/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "approve",
        subreddit: post?.subreddit,
        projectId: document.cookie.match(/currentProjectId=([^;]+)/)?.[1],
      }),
    });
  }

  async function handleEdit(postId: string, title: string, body: string) {
    await fetch(`/api/reddit/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "edit", title, text: body }),
    });
    setPosts((prev) => prev.map((p) => p.postId === postId ? { ...p, title, body } : p));
  }

  function handleGenerated(newPosts: Post[]) {
    if (tab === "drafts") {
      setPosts((prev) => [...newPosts, ...prev]);
    } else {
      setTab("drafts");
      setTimeout(() => fetchPosts("drafts"), 300);
    }
  }

  const drafts    = posts.filter((p) => p.status === "draft");
  const scheduled = posts.filter((p) => p.status === "scheduled");
  const posted    = posts.filter((p) => p.status === "posted");
  const shown     = tab === "drafts" ? drafts : tab === "scheduled" ? scheduled : posted;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar
        breadcrumb={["vibereach.io"]}
        title="Reddit Engine"
        actions={<GenerateDrawer onGenerated={handleGenerated} />}
      />

      <main className="flex-1 p-4 sm:p-6 space-y-5">
        {/* Tabs */}
        <div className="flex items-center gap-0 border-b" style={{ borderColor: "rgba(23,18,12,0.14)" }}>
          {TABS.map((t) => {
            const count = t === "drafts" ? drafts.length : t === "scheduled" ? scheduled.length : posted.length;
            return (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px capitalize transition-colors"
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  borderColor: tab === t ? "#F23005" : "transparent",
                  color: tab === t ? "#17120C" : "#8A8071",
                }}>
                {t}
                {count > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-sm text-[0.58rem]"
                    style={{ background: tab === t ? "#F23005" : "rgba(23,18,12,0.10)", color: tab === t ? "#EFE7D6" : "#8A8071" }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 border rounded-sm animate-pulse"
                style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.10)" }} />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-2xl mb-4" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>▣</span>
            <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
              {tab === "drafts" ? "No drafts yet" : tab === "scheduled" ? "Nothing scheduled" : "Nothing posted yet"}
            </p>
            <p className="text-xs max-w-xs" style={{ color: "#8A8071" }}>
              {tab === "drafts"
                ? "Click Generate more to create posts for a subreddit from your playbook."
                : tab === "scheduled"
                ? "Approve drafts to add them to the drip queue."
                : "Approved posts will appear here once they go live."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tab === "drafts" && shown.map((post) => (
              <DraftCard key={post.postId} post={post} onApprove={handleApprove} onEdit={handleEdit} />
            ))}

            {tab === "scheduled" && shown.map((post) => (
              <div key={post.postId} className="border rounded-sm px-4 py-4"
                style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
                        style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
                        r/{post.subreddit}
                      </span>
                      <Tag variant="add">{VARIANT_LABEL[post.variant]}</Tag>
                    </div>
                    <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
                      {post.title}
                    </p>
                  </div>
                  {post.scheduledAt && (
                    <p className="text-[0.65rem] shrink-0"
                      style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
                      {new Date(post.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {tab === "posted" && shown.map((post) => (
              <div key={post.postId} className="border rounded-sm px-4 py-4"
                style={{ background: "#F4EEE0", borderColor: "rgba(23,18,12,0.14)" }}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
                    style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
                    r/{post.subreddit}
                  </span>
                  {post.postedAt && (
                    <p className="text-[0.65rem]" style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
                      {new Date(post.postedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </div>
                <p className="text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-bricolage), sans-serif", color: "#17120C" }}>
                  {post.title}
                </p>
                {post.metrics && (
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[0.65rem] uppercase tracking-[0.08em]"
                      style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
                      {post.metrics.upvotes} upvotes
                    </span>
                    <span className="text-[0.65rem] uppercase tracking-[0.08em]"
                      style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#8A8071" }}>
                      {post.metrics.comments} comments
                    </span>
                    {post.metrics.signups > 0 && (
                      <span className="text-[0.65rem] uppercase tracking-[0.08em]"
                        style={{ fontFamily: "var(--font-jetbrains), monospace", color: "#3E8E4F" }}>
                        {post.metrics.signups} signups
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
