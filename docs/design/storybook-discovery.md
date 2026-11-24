# Storybook discovery
PR 2 replaces the generic hero with an editorial split composition using existing local AVIF artwork, four illustrated collection links and four curated puzzles. The homepage and library are server components; only the optional completed collection and gameplay preferences require browser state. Collection URLs are statically exported and work on direct entry, refresh and back navigation. No search-param hydration dependency or additional packages.

First-visit setup is deferred to entry into a puzzle, before mounting the ThreeShell runtime. Existing preferences are preserved. The parent route remains accessible without onboarding. Library density, pagination, completion decoration, and full gameplay responsiveness are future PRs.

Review at 320, 390, 768, 1280 and 1440px; check keyboard focus, title wrapping, artwork aspect ratio, localStorage hydration, first-play setup, and all four collection deep links. Browser validation and visual scoring are not completed.
