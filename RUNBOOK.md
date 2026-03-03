# Routing & Deploy Runbook

## Scope
This repo serves the blog app, while `tangle.tools` marketing pages stay on Webflow.
Cloudflare Worker routes only blog paths to the blog origin.

Canonical public paths:
- Posts: `/post/<slug>`
- Legacy redirects: `/blog/<slug>` -> `301 /post/<slug>`
- Blog index: `/post`

## Netlify Requirements
- A dedicated Netlify site hosts this Next.js app.
- The site must be reachable at the hostname used by `BLOG_ORIGIN` (default: `https://blog-origin.tangle.tools`).
- Production deploys must target branch `main`.
- GitHub Actions secret `NETLIFY_BUILD_HOOK` must be set so `.github/workflows/ci-and-deploy.yml` can trigger production deploys on `main` pushes.

## Cloudflare Worker Requirements
Worker config lives in `worker/`.

Required routes (same as `worker/wrangler.toml`):
- `tangle.tools/blog`
- `tangle.tools/blog/*`
- `tangle.tools/post`
- `tangle.tools/post/*`
- `tangle.tools/feed.xml`
- `tangle.tools/sitemap.xml`
- `tangle.tools/images/*`
- `tangle.tools/og`
- `tangle.tools/og/*`

Worker behavior:
- Redirects `/blog` and `/blog/*` to `/post` and `/post/*` with `301`.
- Proxies `/post/*`, `/feed.xml`, `/sitemap.xml`, `/images/*`, `/og/*` to `BLOG_ORIGIN`.
- Adds debug headers on proxied responses:
  - `x-tangle-blog-proxy: 1`
  - `x-tangle-blog-origin: <origin>`
  - `x-tangle-blog-path: <path>`
  - `x-served-by: tangle-blog-worker`

## DNS / Proxy Requirements
- `tangle.tools` must be proxied by Cloudflare (orange cloud), otherwise Worker routes do not run.
- `blog-origin.tangle.tools` must resolve to the Netlify site (typically CNAME to Netlify target).
- Keep `blog-origin.tangle.tools` out of Worker route patterns to avoid proxy loops.
- Ensure TLS is valid for both `tangle.tools` and the blog origin hostname.

## Verification Commands
Run after each deploy.

```bash
# 1) Legacy redirect should be 301 to /post/<slug>
curl -sSI "https://tangle.tools/blog/trusted-execution-on-tangle" | sed -n '1p;/^location:/Ip'

# 2) Canonical post should be proxied (debug headers must exist)
curl -sSI "https://tangle.tools/post/trusted-execution-on-tangle" | sed -n '1p;/^x-tangle-blog-/Ip;/^x-served-by:/Ip'

# 3) Feed and sitemap should be proxied
curl -sSI "https://tangle.tools/feed.xml" | sed -n '1p;/^x-tangle-blog-/Ip'
curl -sSI "https://tangle.tools/sitemap.xml" | sed -n '1p;/^x-tangle-blog-/Ip'

# 4) OG and static image paths should be proxied
curl -sSI "https://tangle.tools/og" | sed -n '1p;/^x-tangle-blog-/Ip'
curl -sSI "https://tangle.tools/images/covers/tangle-editorial-tee.svg" | sed -n '1p;/^x-tangle-blog-/Ip'

# 5) Non-blog marketing route should not include worker proxy headers
curl -sSI "https://tangle.tools/" | sed -n '1p;/^x-tangle-blog-/Ip;/^x-served-by:/Ip'
```

Expected:
- `/blog/...` returns `301` with `Location: https://tangle.tools/post/...`.
- Proxied blog routes return `200` (or normal app status) and include `x-tangle-blog-*` headers.
- Non-blog routes do not include `x-tangle-blog-*` headers.

## Worker Deploy
```bash
cd worker
npm install
npm run deploy
```

If blog origin changes:
- Update Worker env var `BLOG_ORIGIN` (Wrangler vars or dashboard env).
- Redeploy Worker.
- Re-run verification commands.
