/**
 * Cloudflare Worker path-router for mixed hosting:
 * - Marketing site stays on Webflow (default origin)
 * - Blog paths are proxied to BLOG_ORIGIN
 *
 * Deploy: cd worker && npm run deploy
 */

interface Env {
  BLOG_ORIGIN?: string;
}

const DEFAULT_BLOG_ORIGIN = "https://blog-origin.tangle.tools";
const BLOG_PATH_PREFIXES = ["/post/", "/images/", "/og/", "/_next/", "/brand/"];
const BLOG_EXACT_PATHS = new Set([
  "/post",
  "/images",
  "/og",
  "/_next",
  "/brand",
  "/feed.xml",
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.ico",
]);

function isBlogPath(pathname: string): boolean {
  return (
    BLOG_EXACT_PATHS.has(pathname) ||
    BLOG_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

function resolveBlogOrigin(rawOrigin?: string): URL {
  const candidate = rawOrigin?.trim();
  if (!candidate) return new URL(DEFAULT_BLOG_ORIGIN);

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed;
    }
  } catch {
    // Fallback to default when BLOG_ORIGIN is malformed.
  }

  return new URL(DEFAULT_BLOG_ORIGIN);
}

function withBlogOrigin(url: URL, blogOrigin: URL): string {
  const target = new URL(url.toString());
  const basePath = blogOrigin.pathname === "/" ? "" : blogOrigin.pathname.replace(/\/$/, "");

  target.hostname = blogOrigin.hostname;
  target.protocol = blogOrigin.protocol;
  target.port = blogOrigin.port;
  target.pathname = `${basePath}${url.pathname}`.replace(/\/{2,}/g, "/");

  return target.toString();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Legacy Webflow blog path -> new blog path
    if (pathname === "/blog" || pathname === "/blog/") {
      return Response.redirect(`${url.origin}/post${url.search}`, 301);
    }

    if (pathname.startsWith("/blog/")) {
      const nextPath = pathname.replace(/^\/blog(?=\/)/, "/post");
      return Response.redirect(`${url.origin}${nextPath}${url.search}`, 301);
    }

    if (!isBlogPath(pathname)) {
      // Non-blog routes: keep default Webflow origin
      return fetch(request);
    }

    const blogOrigin = resolveBlogOrigin(env.BLOG_ORIGIN);
    const blogUrl = withBlogOrigin(url, blogOrigin);
    const proxiedRequest = new Request(blogUrl, request);
    const response = await fetch(proxiedRequest);

    const wrapped = new Response(response.body, response);
    wrapped.headers.set("x-served-by", "tangle-blog-worker");
    wrapped.headers.set("x-tangle-blog-proxy", "1");
    wrapped.headers.set("x-tangle-blog-origin", blogOrigin.origin);
    wrapped.headers.set("x-tangle-blog-path", pathname);
    return wrapped;
  },
};
