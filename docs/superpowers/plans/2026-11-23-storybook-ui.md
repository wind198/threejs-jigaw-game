# Little Jigsaw Storybook UI Implementation Plan

> For agentic workers: validate the completed feature against the acceptance checklist before merging.

**Goal:** Replace the single screen with a static, pastel storybook home, image-first puzzle library, one-time onboarding, game view, and gated parent preferences.

**Architecture:** Keep the Vite/React application and the existing ThreeShell scene. HashRouter makes navigation host-independent without server rewrites. Zustand holds transient UI filter state; usehooks-ts manages local preference/completion storage. Puzzle image manifests and artwork are local.

**Tech Stack:** React 19, Vite 7, Three.js, ThreeShell, Zustand, usehooks-ts, lucide-react, CSS.

## Checklist
- [x] Add static asset manifest and three local puzzle illustrations
- [x] Add Home, Library, Parents and setup overlay
- [x] Persist setup preferences with usehooks-ts
- [x] Parameterize ThreeShell puzzle size and image
- [x] Keep parent donations separate; no donation CTA during gameplay
- [ ] Run clean dependency install, typecheck and browser smoke tests in network-enabled CI
- [ ] Verify 25-piece mobile tray usability and WCAG keyboard-accessible drag alternative

## Constraints / Follow-ups
- This feature deliberately does not migrate the application to Next.js. That can be done separately without mixing framework and UX changes.
- No backend; image assets are in public/assets/puzzles.
- Static hosting uses hash URLs; clean URLs require server fallback configuration.
- Browser persistence is device-local and can be cleared by the browser.
- Buy Me a Coffee creator URL is not configured; parent page links only to provider homepage.
- Additional audio assets, saved per-piece restoration and accessible non-drag interaction are follow-on work.
