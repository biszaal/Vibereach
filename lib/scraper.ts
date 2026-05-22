import * as cheerio from "cheerio";

export interface ScrapedContent {
  url: string;
  title: string;
  description: string;
  headings: string[];
  bodyText: string;
  wordCount: number;
}

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  let html: string;
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "VibeReach/1.0 (+https://vibereach.io; marketing-analysis bot)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    html = await res.text();
  } finally {
    clearTimeout(timeout);
  }

  const $ = cheerio.load(html);

  // Remove noise
  $("script, style, nav, footer, header, iframe, noscript, [aria-hidden='true']").remove();

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim() ||
    $("h1").first().text().trim() ||
    url;

  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";

  const headings: string[] = [];
  $("h1, h2, h3").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text && headings.length < 20) headings.push(text);
  });

  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);

  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  return { url, title, description, headings, bodyText, wordCount };
}
