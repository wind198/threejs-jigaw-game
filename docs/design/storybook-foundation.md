# Storybook design foundation
The interface uses warm paper, forest ink, restrained terracotta and honey accents. Puzzle artwork stays square and uncropped. Functional icons remain Lucide; expressive assets remain local Fluent SVGs. No CDN or remote font dependency. Georgia and system rounded fonts are interim fallbacks; licensed local Fraunces/Nunito files are deferred until sourced and verified.

## Asset contract
Canonical AVIF files live in src/assets/puzzle-images/{animals,nature,space,vehicles}/slug--complexity.avif. The predev/prebuild lifecycle generates a typed catalog and copies the canonical artwork to public/assets/puzzle-images. Commit manifest updates alongside artwork (npm run assets:sync). CI checks manifest freshness. Category-prefixed IDs prevent cross-category collisions; original three routes remain valid. Artwork complexity is distinct from the user's piece count.

## Review
Check square artwork, keyboard focus, 48px controls, text contrast, mobile overflow and static export. Full homepage art direction, library pagination, portrait scene geometry, accessible modal migration and motion review are subsequent PRs. Do not assign a visual score without browser QA.
