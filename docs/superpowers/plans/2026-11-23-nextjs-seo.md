# Next.js Static SEO Migration

> For agentic workers: verify build, route HTML and browser behavior before merge.

**Goal:** Replace Vite/hash navigation with Next.js 16 App Router and static export, retaining a backend-free game.

**Architecture:** App Router Server Component pages are statically generated for home, gallery, parent information and every catalog puzzle. Interactive screens are client components using Zustand/usehooks-ts; ThreeShell/Three.js stays browser-only. Public assets remain bundled in the repo.

**Tech stack:** Next.js 16.4.6, React 19, TypeScript 5.9, Three.js, ThreeShell, Zustand, usehooks-ts.

## Acceptance
- [x] `next.config.ts` uses `output: 'export'` and `trailingSlash: true`
- [x] Generated routes: `/`, `/puzzles/`, `/parents/`, `/play/{puzzleId}/`
- [x] Every puzzle has build-time static params, title, description and Open Graph metadata
- [x] Homepage and library links are crawlable standard anchor URLs (Next Link)
- [x] No server runtime, API routes or dynamic SSR
- [x] Remove Vite configuration, old index.html and HashRouter
- [ ] CI verifies build succeeds and exports each puzzle page
- [ ] Verify deployed host serves trailing-slash directories and static assets
- [ ] Configure real public domain for sitemap/canonical metadata at deployment

## Known follow-ups
- No site URL configured yet; do not fabricate canonical URLs or sitemap domain.
- Visual/browser acceptance, focus-trapped overlays, mobile tray layout and per-piece progress persistence remain separate tasks.
