# PR Notes — Blog Design V2

## Summary
- Introduced a tokenized Tangle editorial design system across shell, index, and post layouts.
- Upgraded MDX rendering quality for code, media, and links (including legacy `/post/*` normalization).
- Added SEO/GEO foundations: canonical/social metadata hardening, default + per-post OG routes, Article JSON-LD, and conditional FAQ JSON-LD.
- Added `DESIGN-AUDIT-V2.md` with before/after analysis, rubric scoring, and unresolved trade-offs.

## Validation Evidence
- `npm run lint` passed.
- `npm run build` passed.

## Screenshot Notes
- Interactive screenshot capture from a live local server is blocked in this sandbox because binding to `0.0.0.0:3000` is not permitted (`listen EPERM`).
- Manual visual checks were performed against compiled output and component/style diff review.

## Commits
1. `9588874` feat: establish tangle editorial design system and mdx rendering
2. `025d0e2` feat: add structured seo data and social metadata polish
