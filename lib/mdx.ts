import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Callout } from "@/components/mdx/callout";
import { CodeBlockWrapper } from "@/components/mdx/code-block";

const prettyCodeOptions: Options = {
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
  keepBackground: true,
  defaultLang: "plaintext",
};

const components = {
  Callout,
  pre: CodeBlockWrapper,
};

export async function renderMDX(source: string) {
  return compileMDX({
    source,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, prettyCodeOptions],
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["anchor"],
              },
            },
          ],
          rehypeKatex,
        ],
      },
    },
  });
}

export function extractHeadings(
  content: string
): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({
      id,
      text,
      level: match[1].length,
    });
  }

  return headings;
}
