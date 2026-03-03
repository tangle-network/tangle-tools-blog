import type { PostFrontmatter } from "@/lib/posts";
import { getAbsolutePostSocialImage } from "@/lib/post-images";

export interface FaqEntry {
  question: string;
  answer: string;
}

const SITE_URL = "https://tangle.tools/post";

function stripMarkdown(raw: string): string {
  return raw
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[>*_~]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\u200d/g, "")
    .trim();
}

function parseReadingMinutes(readingTime: string): number | undefined {
  const match = readingTime.match(/(\d+)/);
  if (!match) return undefined;
  const minutes = Number.parseInt(match[1], 10);
  return Number.isFinite(minutes) ? minutes : undefined;
}

export function buildArticleStructuredData(
  frontmatter: PostFrontmatter,
  slug: string,
  readingTime: string,
  content: string
) {
  const minutes = parseReadingMinutes(readingTime);
  const wordCount = content
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean).length;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.summary,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: {
      "@type": "Person",
      name: frontmatter.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Tangle Network",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: "https://tangle.tools/favicon.ico",
      },
    },
    mainEntityOfPage: `${SITE_URL}/${slug}`,
    url: `${SITE_URL}/${slug}`,
    image: [getAbsolutePostSocialImage(frontmatter, slug)],
    keywords: frontmatter.tags,
    articleSection: frontmatter.series ?? "Blog",
    wordCount,
    ...(minutes ? { timeRequired: `PT${minutes}M` } : {}),
  };
}

export function extractFaqEntries(content: string, maxEntries = 5): FaqEntry[] {
  const lines = content.replace(/\u200d/g, "").split("\n");
  const entries: FaqEntry[] = [];

  let currentQuestion: string | null = null;
  let answerBuffer: string[] = [];

  const flush = () => {
    if (!currentQuestion) return;
    const answer = stripMarkdown(answerBuffer.join(" "));
    if (answer.length > 0) {
      entries.push({
        question: currentQuestion,
        answer,
      });
    }
    currentQuestion = null;
    answerBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const headingMatch = line.match(/^#{2,4}\s+(.+)$/);

    if (headingMatch) {
      const headingText = stripMarkdown(headingMatch[1]);
      if (headingText.endsWith("?")) {
        flush();
        currentQuestion = headingText;
        answerBuffer = [];
        continue;
      }

      flush();
      continue;
    }

    if (!currentQuestion) {
      continue;
    }

    if (line.length === 0) {
      if (answerBuffer.length > 0) {
        answerBuffer.push(" ");
      }
      continue;
    }

    if (line.startsWith("<") && line.endsWith(">")) {
      continue;
    }

    answerBuffer.push(rawLine);
  }

  flush();
  return entries.slice(0, maxEntries);
}

export function buildFaqStructuredData(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}
