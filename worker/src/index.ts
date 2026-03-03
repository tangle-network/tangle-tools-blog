/**
 * Cloudflare Worker path-router for mixed hosting:
 * - Marketing site stays on Webflow (default origin)
 * - Blog paths are proxied to BLOG_ORIGIN
 *
 * Deploy: cd worker && npm run deploy
 */

const BLOG_ORIGIN = "https://blog-origin.tangle.tools";

const BLOG_PATH_PREFIXES = ["/post/", "/images/", "/og/"];
const BLOG_EXACT_PATHS = new Set(["/feed.xml", "/sitemap.xml"]);

function isBlogPath(pathname: string): boolean {
  return (
    BLOG_EXACT_PATHS.has(pathname) ||
    BLOG_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

function withBlogOrigin(url: URL): string {
  const target = new URL(url.toString());
  target.hostname = new URL(BLOG_ORIGIN).hostname;
  target.protocol = new URL(BLOG_ORIGIN).protocol;
  return target.toString();
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Legacy Webflow blog path -> new blog path
    if (pathname.startsWith("/blog/")) {
      const nextPath = "/post/" + pathname.replace(/^\/blog\//, "");
      return Response.redirect(`${url.origin}${nextPath}${url.search}`, 301);
    }

    if (pathname === "/blog") {
      return Response.redirect(`${url.origin}/post${url.search}`, 301);
    }

    if (!isBlogPath(pathname)) {
      // Non-blog routes: keep default Webflow origin
      return fetch(request);
    }

    const blogUrl = withBlogOrigin(url);
    const proxiedRequest = new Request(blogUrl, request);
    const response = await fetch(proxiedRequest);

    const wrapped = new Response(response.body, response);
    wrapped.headers.set("x-served-by", "tangle-blog-worker");
    return wrapped;
  },
};
