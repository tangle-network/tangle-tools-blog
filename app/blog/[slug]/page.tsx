import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPostSlugs, getAdjacentSeriesPosts } from "@/lib/posts";
import { renderMDX, extractHeadings } from "@/lib/mdx";
import {
  buildArticleStructuredData,
  buildFaqStructuredData,
  extractFaqEntries,
} from "@/lib/structured-data";
import { getPostSocialImage } from "@/lib/post-images";
import { PostHeader } from "@/components/post-header";
import { PostFooter } from "@/components/post-footer";
import { TableOfContents } from "@/components/toc";
import { ShareButtons } from "@/components/share-buttons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    const socialImage = getPostSocialImage(post.frontmatter, slug);

    return {
      title: post.frontmatter.title,
      description: post.frontmatter.summary,
      keywords: post.frontmatter.tags,
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: post.frontmatter.title,
        description: post.frontmatter.summary,
        type: "article",
        url: `/blog/${slug}`,
        publishedTime: post.frontmatter.date,
        authors: [post.frontmatter.author],
        tags: post.frontmatter.tags,
        images: [socialImage],
      },
      twitter: {
        card: "summary_large_image",
        title: post.frontmatter.title,
        description: post.frontmatter.summary,
        images: [socialImage],
      },
    };
  } catch {
    return {};
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content, readingTime } = post;
  const headings = extractHeadings(content);
  const faqEntries = extractFaqEntries(content);
  const articleStructuredData = buildArticleStructuredData(
    frontmatter,
    slug,
    readingTime,
    content
  );
  const faqStructuredData =
    faqEntries.length > 0 ? buildFaqStructuredData(faqEntries) : null;
  const { content: mdxContent } = await renderMDX(content);

  const seriesNav =
    frontmatter.series && frontmatter.seriesOrder
      ? getAdjacentSeriesPosts(frontmatter.series, frontmatter.seriesOrder)
      : { prev: null, next: null };

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-10">
        <div className="min-w-0">
          <PostHeader frontmatter={frontmatter} readingTime={readingTime} />
          <div className="surface-card rounded-2xl p-6 sm:p-8">
            <div className="prose max-w-none">{mdxContent}</div>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-[color:var(--border-subtle)] pt-6">
            <ShareButtons title={frontmatter.title} slug={frontmatter.slug} />
          </div>
          <PostFooter
            prev={seriesNav.prev}
            next={seriesNav.next}
            series={frontmatter.series}
          />
        </div>
        <TableOfContents headings={headings} />
      </div>
    </article>
  );
}
