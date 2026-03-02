# Tangle Tools Blog

A standalone Next.js blog for tangle.tools/blog. Designed to replace the Webflow blog with full control over rendering, design, and content authoring.

## Stack

- **Next.js 15** (App Router, RSC)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** for components (buttons, cards, badges, navigation, table of contents)
- **next-mdx-remote** or **@next/mdx** for MDX rendering
- **rehype-pretty-code** + **Shiki** for syntax highlighting (with language tabs, line numbers, line highlighting, copy button)
- **KaTeX** (rehype-katex + remark-math) for math rendering
- **next-themes** for dark/light mode
- **Vercel OG** (@vercel/og) for dynamic OG image generation per post
- **pnpm** as package manager

## Directory Structure

```
tangle-tools-blog/
├── app/
│   ├── layout.tsx          # Root layout with fonts, theme provider
│   ├── page.tsx            # Blog index (card grid of posts)
│   ├── [slug]/
│   │   └── page.tsx        # Individual post page
│   ├── og/
│   │   └── [slug]/
│   │       └── route.tsx   # Dynamic OG image generation
│   └── feed.xml/
│       └── route.ts        # RSS feed
├── content/
│   ├── why-ai-infrastructure-needs-decentralization.mdx
│   ├── how-blueprints-work.mdx
│   ├── how-tangle-verifies-work.mdx
│   ├── building-on-tangle-from-idea-to-production.mdx
│   ├── building-ai-services-on-tangle.mdx
│   └── trusted-execution-on-tangle.mdx   # Day 6
├── components/
│   ├── ui/                 # shadcn components
│   ├── mdx/                # Custom MDX components
│   │   ├── callout.tsx     # Info/warning/tip callout boxes
│   │   ├── code-block.tsx  # Enhanced code block with copy, language label
│   │   ├── tabs.tsx        # Tabbed content (e.g., show Rust vs TypeScript)
│   │   └── math.tsx        # KaTeX wrapper
│   ├── post-card.tsx       # Blog index card
│   ├── post-header.tsx     # Post title, date, reading time, tags
│   ├── post-footer.tsx     # Previous/next navigation, series nav
│   ├── toc.tsx             # Table of contents (sticky sidebar on desktop)
│   ├── header.tsx          # Site header with nav
│   └── footer.tsx          # Site footer
├── lib/
│   ├── posts.ts            # MDX loading, frontmatter parsing, sorting
│   ├── mdx.ts              # MDX compilation config (plugins, components)
│   └── utils.ts            # Reading time, date formatting
├── public/
│   └── images/             # Blog images
├── styles/
│   └── globals.css         # Tailwind + custom prose styles
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── SPEC.md
```

## Design

### Visual Identity
- Clean, technical, minimal. Think Vercel's blog or Linear's changelog.
- Primary font: Inter or Geist Sans for body, Geist Mono or JetBrains Mono for code
- Color palette: Dark mode default. Tangle brand purple (#7C3AED or similar) as accent.
- Generous whitespace. Max content width ~720px for readability.

### Blog Index (`/`)
- Grid of post cards (2 columns desktop, 1 mobile)
- Each card: title, summary, date, reading time, tags, optional hero image
- Series badge if part of a series (e.g., "Tangle Re-Introduction Series")
- Filter by tag/series

### Post Page (`/[slug]`)
- Full-width hero section with title, subtitle, date, reading time, author
- Sticky table of contents on the left sidebar (desktop), collapsible on mobile
- MDX content area with beautiful prose typography
- Code blocks: syntax highlighted, copy button, language label, optional filename header, line numbers, line highlighting
- Math: KaTeX rendered inline and display
- Callout boxes: info (blue), warning (yellow), tip (green), danger (red)
- Series navigation at top and bottom (Previous / Next in series)
- Share buttons (Twitter, copy link)

### Code Blocks (critical - this is a developer blog)
- Shiki with a good theme (one-dark-pro or github-dark)
- Line numbers optional (per block)
- Line highlighting: `{1,3-5}` syntax
- Filename header: ```rust title="src/main.rs"
- Copy button (top-right, appears on hover)
- Language label badge
- Tabbed code groups for showing same concept in multiple languages

## Frontmatter Schema

```yaml
---
title: "Trusted Execution on Tangle: How TEE Works in the Blueprint SDK"
slug: trusted-execution-on-tangle
summary: "How the Blueprint SDK integrates AWS Nitro, GCP Confidential Space, and Azure CVM for hardware-isolated execution."
date: "2026-03-02"
author: "Drew Stone"
tags: ["tee", "security", "sdk"]
series: "Tangle Re-Introduction"
seriesOrder: 6
image: "/images/tee-hero.png"  # optional
---
```

## SEO / GEO

- Dynamic meta tags from frontmatter (title, description, OG image)
- OG images auto-generated with @vercel/og (post title + Tangle branding)
- Structured data (JSON-LD Article schema)
- Canonical URLs pointing to tangle.tools/blog/[slug]
- RSS feed at /feed.xml
- Sitemap generation

## Content Migration

The 5 existing Webflow posts need to be converted to MDX files in `content/`.
For now, create placeholder MDX files with just the frontmatter and a TODO comment.
Focus on building the infrastructure and making Day 6 (TEE post) look great as the first real post.

## Deployment

- Deploy to Netlify (free tier, existing org account)
- Cloudflare Worker in `worker/` routes tangle.tools/blog/* to Netlify
- `next.config.ts` must set `basePath: "/blog"` so all routes are prefixed correctly
- For now, just make it work locally with `pnpm dev`

## Constraints

- No over-engineering. Ship a beautiful blog, not a CMS.
- Content is MDX files in the repo. No database, no API.
- Mobile-first responsive design
- Lighthouse score > 95 on all metrics
- Total JS bundle < 100kb first load
- Use shadcn/ui components where they make sense (don't reinvent)
- Dark mode default, light mode toggle available
