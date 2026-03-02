import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPostSlugs, getAdjacentSeriesPosts } from "@/lib/posts";
import { renderMDX, extractHeadings } from "@/lib/mdx";
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
    return {
      title: post.frontmatter.title,
      description: post.frontmatter.summary,
      openGraph: {
        title: post.frontmatter.title,
        description: post.frontmatter.summary,
        type: "article",
        publishedTime: post.frontmatter.date,
        authors: [post.frontmatter.author],
        tags: post.frontmatter.tags,
        images: [`/og/${slug}`],
      },
      twitter: {
        card: "summary_large_image",
        title: post.frontmatter.title,
        description: post.frontmatter.summary,
        images: [`/og/${slug}`],
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
  const { content: mdxContent } = await renderMDX(content);

  const seriesNav =
    frontmatter.series && frontmatter.seriesOrder
      ? getAdjacentSeriesPosts(frontmatter.series, frontmatter.seriesOrder)
      : { prev: null, next: null };

  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10">
        <div className="min-w-0">
          <PostHeader frontmatter={frontmatter} readingTime={readingTime} />
          <div className="prose max-w-none">{mdxContent}</div>
          <div className="mt-10 flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-neutral-800">
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
