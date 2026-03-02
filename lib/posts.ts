import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDirectory = path.join(process.cwd(), "content");

export interface PostFrontmatter {
  title: string;
  slug: string;
  summary: string;
  date: string;
  author: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  image?: string;
}

export interface Post {
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(contentDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): Post {
  const filePath = path.join(contentDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: stats.text,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  return slugs
    .map((slug) => getPostBySlug(slug))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getPostsInSeries(series: string): Post[] {
  return getAllPosts()
    .filter((post) => post.frontmatter.series === series)
    .sort(
      (a, b) =>
        (a.frontmatter.seriesOrder ?? 0) - (b.frontmatter.seriesOrder ?? 0)
    );
}

export function getAdjacentSeriesPosts(
  series: string,
  currentOrder: number
): { prev: Post | null; next: Post | null } {
  const seriesPosts = getPostsInSeries(series);
  const currentIndex = seriesPosts.findIndex(
    (p) => p.frontmatter.seriesOrder === currentOrder
  );

  return {
    prev: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    next:
      currentIndex < seriesPosts.length - 1
        ? seriesPosts[currentIndex + 1]
        : null,
  };
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post) => post.frontmatter.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
