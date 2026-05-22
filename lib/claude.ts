import Anthropic from "@anthropic-ai/sdk";
import {
  PLAYBOOK_SYSTEM,
  REDDIT_SYSTEM,
  AUDIT_SYSTEM,
  buildPlaybookUserMessage,
  buildRedditUserMessage,
  buildAuditUserMessage,
} from "./prompts";
import type { ScrapedContent } from "./scraper";

export interface Persona {
  name: string;
  age: string;
  description: string;
}

export interface Subreddit {
  name: string;
  fitScore: number;
  subscribers: string;
  angle: string;
}

export interface Voice {
  tone: string;
  traits: string[];
}

export interface Playbook {
  summary: string;
  personas: Persona[];
  pains: string[];
  valueProps: string[];
  voice: Voice;
  subreddits: Subreddit[];
}

export interface RedditPost {
  variant: "founder-story" | "question-led" | "value-first";
  title: string;
  body: string;
}

export interface AuditReport {
  score: number;
  critical: { title: string; why: string }[];
  recommended: { title: string; why: string }[];
  headlineRewrite: string;
  metaRewrite: string;
  missingElements: string[];
}

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

async function call(system: string, user: string): Promise<string> {
  const client = getClient();
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system,
    messages: [{ role: "user", content: user }],
  });
  const block = msg.content[0];
  if (block.type !== "text") throw new Error("Unexpected Claude response type");
  // Strip accidental markdown fences
  return block.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}

export async function generatePlaybook(scraped: ScrapedContent): Promise<Playbook> {
  const raw = await call(PLAYBOOK_SYSTEM, buildPlaybookUserMessage(scraped));
  return JSON.parse(raw) as Playbook;
}

export async function generateRedditPosts(
  playbook: Playbook,
  subreddit: string,
  angle: string
): Promise<RedditPost[]> {
  const raw = await call(REDDIT_SYSTEM, buildRedditUserMessage(playbook, subreddit, angle));
  return JSON.parse(raw) as RedditPost[];
}

export async function generateAudit(
  page: ScrapedContent & { loadTimeMs?: number }
): Promise<AuditReport> {
  const raw = await call(AUDIT_SYSTEM, buildAuditUserMessage(page));
  return JSON.parse(raw) as AuditReport;
}
