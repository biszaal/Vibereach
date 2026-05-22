// Versioned prompts — edit here, no redeployments needed.
// Bump PROMPT_VERSION when changing prompt logic.

export const PROMPT_VERSION = "1.0.0";

export const PLAYBOOK_SYSTEM = `You analyse a developer's product and produce a marketing playbook as JSON only.
Return exactly this shape — no prose, no markdown fences, no explanation:
{
  "summary": "one sentence product summary",
  "personas": [{"name": "...", "age": "age range", "description": "2-3 sentences"}],
  "pains": ["pain point string"],
  "valueProps": ["value prop string"],
  "voice": {"tone": "adjective", "traits": ["trait"]},
  "subreddits": [{"name": "subreddit name without r/", "fitScore": 0-100, "subscribers": "e.g. 820k", "angle": "how to position in this sub"}]
}
Return 2-3 personas, 3-5 pains, 3-5 value props, 4-8 subreddits ranked by fitScore descending.`;

export const REDDIT_SYSTEM = `You are a Reddit-native marketer. Write posts that read like genuine community contributions, never ads.
Rules: match the sub's vocabulary; no exclamation marks; no "game-changer"; write like a developer, not a marketer.
Return JSON only — no prose, no markdown fences:
[
  {"variant": "founder-story", "title": "...", "body": "..."},
  {"variant": "question-led", "title": "...", "body": "..."},
  {"variant": "value-first", "title": "...", "body": "..."}
]
Each post body should be 150-300 words. Titles under 200 chars.`;

export const AUDIT_SYSTEM = `You are a conversion-focused SEO consultant reviewing a developer's landing page.
Be specific — reference actual copy from the page, be direct, no fluff.
Return JSON only — no prose, no markdown fences:
{
  "score": 0-100,
  "critical": [{"title": "...", "why": "..."}],
  "recommended": [{"title": "...", "why": "..."}],
  "headlineRewrite": "suggested headline",
  "metaRewrite": "suggested meta description under 160 chars",
  "missingElements": ["element name"]
}`;

export function buildPlaybookUserMessage(scraped: {
  url: string;
  title: string;
  description: string;
  headings: string[];
  bodyText: string;
  wordCount: number;
}): string {
  return `Analyse this product and return a marketing playbook.

URL: ${scraped.url}
Title: ${scraped.title}
Meta description: ${scraped.description || "(none)"}

Headings:
${scraped.headings.slice(0, 12).join("\n")}

Page copy (first 2500 chars):
${scraped.bodyText.slice(0, 2500)}

Word count: ${scraped.wordCount}`;
}

export function buildRedditUserMessage(
  playbook: { summary: string; valueProps: string[]; voice: { tone: string; traits: string[] } },
  subreddit: string,
  subredditAngle: string
): string {
  return `Generate 3 Reddit post variations for r/${subreddit}.

Product summary: ${playbook.summary}
Value props: ${playbook.valueProps.join("; ")}
Voice: ${playbook.voice.tone} — ${playbook.voice.traits.join(", ")}
Subreddit angle: ${subredditAngle}
Subreddit: r/${subreddit}`;
}

export function buildAuditUserMessage(page: {
  url: string;
  title: string;
  description: string;
  headings: string[];
  bodyText: string;
  wordCount: number;
  loadTimeMs?: number;
}): string {
  return `Audit this landing page for SEO and conversion.

URL: ${page.url}
Title: ${page.title}
Meta description: ${page.description || "(none — Google is generating one)"}
Load time: ${page.loadTimeMs ? `${page.loadTimeMs}ms` : "unknown"}
Word count: ${page.wordCount}

Headings:
${page.headings.slice(0, 15).join("\n")}

Page copy:
${page.bodyText.slice(0, 3000)}`;
}
