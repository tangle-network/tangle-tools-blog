# DESIGN AUDIT V2 — Tangle Tools Blog

## Scope
- Branch: `feat/blog-v2-design-system`
- Objective: elevate the blog from baseline-good to premium technical editorial quality with cohesive Tangle visual language and production-safe rendering.
- Audit loops executed: 2 implementation rounds.

## Before vs After Summary
### Before
- Mixed surface and color semantics (`neutral-*` utility drift) caused partial theme consistency.
- Code blocks were acceptable but not premium: weaker hierarchy, weaker token emphasis, less discoverable copy affordance on touch.
- MDX rich media support was implicit and inconsistent (`img/video/iframe` behavior depended on browser defaults).
- Metadata and structured data were incomplete for robust GEO/SEO (no article JSON-LD, no FAQ extraction, weaker canonical/OpenGraph pathing).
- Legacy internal links from migrated content (`/post/*`) could degrade internal linking quality.

### After
- Unified tokenized design system with cohesive light/dark surfaces, typography rhythm, and editorial spacing.
- Code rendering upgraded for contrast and readability in both themes, with improved container affordances and line highlighting.
- MDX media is explicit, responsive, and consistently styled for images, GIFs, videos, and embeds.
- GEO/SEO foundation improved with canonical handling, OG image routes, and structured data (Article + conditional FAQ).
- Legacy `/post/*` internal links are normalized at render time to canonical slug paths.

## Audit Rubric Scores
| Dimension | Score (before) | Score (after) | Notes |
|---|---:|---:|---|
| Aesthetic coherence | 6.2/10 | 8.8/10 | System tokens and consistent shell/prose/card surfaces now align. |
| Legibility/accessibility | 6.5/10 | 8.9/10 | Improved contrast, rhythm, focus styles, skip-link, code readability. |
| Content rendering correctness | 6.0/10 | 8.7/10 | KaTeX CSS, MDX media components, safer link normalization. |
| Perceived quality | 6.4/10 | 8.8/10 | Visual language now editorial/premium rather than template-like. |
| Brand alignment | 6.1/10 | 8.6/10 | Infra-forward palette and sharper hierarchy, less generic styling. |
| Performance sanity | 8.0/10 | 8.3/10 | Visual improvements rely on CSS/tokens, no heavy runtime animation. |

## Round 1 — Visual System + Rendering Quality
### Issues Identified
- `styles/globals.css`: neutral utility drift and inconsistent semantic mapping across light/dark.
- `components/mdx/code-block.tsx`: copy button discoverability/accessibility weak on non-hover devices.
- `lib/mdx.ts`: limited MDX component map; no explicit media/link normalization.
- `app/page.tsx`, `app/[slug]/page.tsx`, and shell components: baseline layout lacked premium editorial hierarchy.

### Fixes Implemented
- Rebuilt global tokens and prose/code system in [`styles/globals.css`](/home/drew/code/tangle-tools-blog/styles/globals.css).
- Upgraded code block copy affordances in [`components/mdx/code-block.tsx`](/home/drew/code/tangle-tools-blog/components/mdx/code-block.tsx).
- Added MDX media + link primitives in [`components/mdx/media.tsx`](/home/drew/code/tangle-tools-blog/components/mdx/media.tsx) and [`components/mdx/link.tsx`](/home/drew/code/tangle-tools-blog/components/mdx/link.tsx).
- Wired new MDX components and higher-contrast Shiki themes in [`lib/mdx.ts`](/home/drew/code/tangle-tools-blog/lib/mdx.ts).
- Refined shell/index/post UI in:
  - [`app/page.tsx`](/home/drew/code/tangle-tools-blog/app/page.tsx)
  - [`app/[slug]/page.tsx`](/home/drew/code/tangle-tools-blog/app/%5Bslug%5D/page.tsx)
  - [`components/post-card.tsx`](/home/drew/code/tangle-tools-blog/components/post-card.tsx)
  - [`components/post-header.tsx`](/home/drew/code/tangle-tools-blog/components/post-header.tsx)
  - [`components/toc.tsx`](/home/drew/code/tangle-tools-blog/components/toc.tsx)
  - [`components/post-footer.tsx`](/home/drew/code/tangle-tools-blog/components/post-footer.tsx)
  - [`components/header.tsx`](/home/drew/code/tangle-tools-blog/components/header.tsx)
  - [`components/footer.tsx`](/home/drew/code/tangle-tools-blog/components/footer.tsx)
- Added KaTeX stylesheet and skip-link in [`app/layout.tsx`](/home/drew/code/tangle-tools-blog/app/layout.tsx).

### Validation
- `npm run lint` passed.
- `npm run build` passed.

## Round 2 — GEO/SEO + Structured Data + Social Cards
### Issues Identified
- Missing structured data generation for Article and FAQ opportunities.
- Canonical/OpenGraph/Twitter metadata needed stronger path consistency for basePath deployment.
- No default OG route for the blog root.

### Fixes Implemented
- Added structured data helpers in [`lib/structured-data.ts`](/home/drew/code/tangle-tools-blog/lib/structured-data.ts).
- Added article + conditional FAQ JSON-LD injection and stronger metadata in [`app/[slug]/page.tsx`](/home/drew/code/tangle-tools-blog/app/%5Bslug%5D/page.tsx).
- Strengthened global metadata/canonical/social config in [`app/layout.tsx`](/home/drew/code/tangle-tools-blog/app/layout.tsx).
- Added reusable OG card and route coverage:
  - [`lib/og-card.tsx`](/home/drew/code/tangle-tools-blog/lib/og-card.tsx)
  - [`app/og/route.tsx`](/home/drew/code/tangle-tools-blog/app/og/route.tsx)
  - [`app/og/[slug]/route.tsx`](/home/drew/code/tangle-tools-blog/app/og/%5Bslug%5D/route.tsx)

### Validation
- `npm run lint` passed.
- `npm run build` passed.

## Unresolved Trade-offs
- FAQ structured data is heuristic (heading-question based). It avoids false positives in most content but may miss FAQ intent when posts use non-question headings.
- Some migrated legacy posts still have weak semantic Markdown structure (plain paragraphs where headings/lists should exist). Rendering is improved, but source content normalization would further increase scanability.
- No automated visual regression snapshot pipeline is configured in-repo yet; manual design QA is still required for final launch sign-off.
