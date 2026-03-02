/**
 * Cloudflare Worker that routes /blog/* to the Vercel-hosted Next.js blog.
 * Everything else falls through to Webflow (the default origin).
 *
 * Deploy: cd worker && npx wrangler deploy
 * Dev:    cd worker && npx wrangler dev
 */

// Update this to your Netlify deployment URL
const BLOG_ORIGIN = "https://tangle-tools-blog.netlify.app";

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/blog" || url.pathname.startsWith("/blog/")) {
      const originUrl = `${BLOG_ORIGIN}${url.pathname}${url.search}`;
      const originRequest = new Request(originUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "follow",
      });

      const response = await fetch(originRequest);

      // Clone response to modify headers
      const newResponse = new Response(response.body, response);
      // Preserve cache headers from Vercel
      newResponse.headers.set("x-served-by", "tangle-blog-worker");
      return newResponse;
    }

    // Non-blog routes: pass through to Webflow (default origin)
    return fetch(request);
  },
};
