# Little Jigsaw 3D

A free, pastel storybook-style 3D jigsaw game for kids aged 3–10.

**Stack:** Next.js 16 App Router (static export), React 19, Three.js/ThreeShell, Zustand, usehooks-ts, TypeScript. No runtime server, database, account or external content API.

## Development

Requires Node.js 22+.

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

The static site is emitted to `out/` by `npm run build`, suitable for any static host that serves directory `index.html` files. `next.config.ts` enables `trailingSlash` for that deployment model.

**Production asset caching:** `public/_headers` (Cloudflare Pages / Netlify) and `public/serve.json` (used by `npm start`) set `Cache-Control: public, max-age=31536000, immutable` on `/assets/*` and force revalidation for HTML. `next dev` still uses `max-age=0`. When replacing a cached audio/image file in place, change the filename (or wait for TTL).

## SEO / Pages

- `/` — Home, indexable
- `/puzzles/` — catalog page, indexable
- `/play/sunny-valley/` — game-specific static HTML with puzzle metadata
- `/play/forest-friends/` — game-specific static HTML with puzzle metadata
- `/play/moon-adventure/` — game-specific static HTML with puzzle metadata
- `/parents/` — parent settings and privacy; excluded from search indexing

`app/play/[puzzleId]/page.tsx` uses `generateStaticParams` to pre-render every catalog puzzle and `generateMetadata` for unique titles, descriptions and Open Graph summaries. Add puzzles to `src/content/puzzles.ts` to create more pages at build time.

**Domain-dependent SEO:** Canonical URLs, sitemap.xml and production Open Graph absolute image URLs should be configured after the public site domain is selected. Do not deploy with placeholder domains.

## First-visit setup

The first visit shows a one-time setup (4, 9, or 25 pieces, hints and sound). `usehooks-ts/useLocalStorage` persists settings as `little-jigsaw:preferences:v1`. A parent can change them later in `/parents/`; without stored preferences, onboarding appears again after browser site data is cleared.

Completed puzzle IDs are saved in `little-jigsaw:completed:v1`; in-progress individual piece positions are **not yet restored**.

## Static assets

All puzzle illustrations and audio are committed under `public/assets/`. The catalog is a TypeScript manifest in `src/content/puzzles.ts`. ThreeShell owns scene rendering, raycasting, snapping and animations; React owns page chrome and overlays.

## Limitations and pending QA

- Parent reading challenge is a UX deterrent, **not age verification**.
- The parent support link points to Buy Me a Coffee's homepage until a creator URL is configured.
- Browser and responsive QA still required; particularly 25-piece portrait trays and accessibility.
- No font/CDN dependencies at runtime; local/system fonts are used.
- A fresh lockfile and passing build CI are required before merge.
