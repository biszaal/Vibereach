import { TopBar } from "@/components/layout/TopBar";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RedditCard } from "@/components/ui/RedditCard";

const drafts = [
  {
    subreddit: "indiehackers",
    title: "I built a tool to help devs who can ship anything but nobody ever hears about them",
    body: "Six months ago I launched a side project I was genuinely proud of. One upvote on Product Hunt. Zero signups from Twitter. It just — vanished.\n\nI realised I had no idea how to talk about my own products. I can build anything, but marketing felt like a foreign language. So I built VibeReach to solve my own problem. It analyses your product, generates Reddit posts that actually sound human, and drip-schedules them with your approval.\n\nSharing here because this community has shaped how I think about building. Curious if others have hit the same wall.",
    fitScore: 94,
    variant: "founder-story" as const,
    status: "draft" as const,
  },
  {
    subreddit: "SideProject",
    title: "How do you actually get traction for a new project? Asking for a resource",
    body: "I've been collecting notes on what actually works for early-stage project marketing — not the generic 'post on Product Hunt' advice but the specific moves that get real traction.\n\nBuilt a small tool (VibeReach) that analyses your landing page and generates native Reddit posts per sub — happy to share what I've learned about what subreddits actually convert if anyone's interested.\n\nWhat's worked for your projects?",
    fitScore: 88,
    variant: "question-led" as const,
    status: "draft" as const,
  },
  {
    subreddit: "webdev",
    title: "A checklist I use before posting anything about my side project on Reddit",
    body: "After getting shadow-banned on a few subs, I put together a process that's helped me post without getting flagged:\n\n1. Read the sub rules — obvious, but most people don't\n2. Check your account age and karma for that sub\n3. Lead with value, mention the product naturally\n4. Never post the same thing twice, even across subs\n5. Space posts by at least 72 hours\n\nI actually built this into a tool (VibeReach) that does the subreddit research automatically. The manual version above still works though.",
    fitScore: 76,
    variant: "value-first" as const,
    status: "draft" as const,
  },
];

const posted = [
  {
    subreddit: "indiehackers",
    title: "What I learned from 3 failed launches",
    body: "Each one taught me something. Third one is finally getting traction.",
    fitScore: 91,
    variant: "founder-story" as const,
    status: "posted" as const,
    upvotes: 12,
    signups: 3,
  },
];

export default function RedditPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar
        breadcrumb={["vibereach.io"]}
        title="Reddit Engine"
        actions={
          <button
            className="text-xs font-semibold px-4 py-1.5 rounded-sm border shadow-hard-sm"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              background: "#17120C",
              color: "#EFE7D6",
              borderColor: "#17120C",
            }}
          >
            Generate more
          </button>
        }
      />
      <main className="flex-1 p-6 space-y-8">
        {/* Drafts */}
        <div>
          <SectionLabel className="mb-4">Drafts awaiting approval</SectionLabel>
          <div className="space-y-4">
            {drafts.map((d, i) => (
              <RedditCard key={i} {...d} />
            ))}
          </div>
        </div>

        {/* Posted */}
        <div>
          <SectionLabel className="mb-4">Posted</SectionLabel>
          <div className="space-y-3">
            {posted.map((p, i) => (
              <RedditCard key={i} {...p} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
