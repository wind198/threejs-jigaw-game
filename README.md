# Little Jigsaw 3D

A completely free, static, storybook-style jigsaw game for children aged 3–10. Built with React, Vite, Three.js and the existing ThreeShell core runtime.

## Run

Node.js 22+:

```sh
npm install
npm run dev
npm test
npm run build
```

Open http://localhost:3000.

> This branch introduces new dependencies and temporarily removes the stale pnpm lockfile. Regenerate and commit a lockfile before merging; CI currently installs with npm.

## Pages

Navigation uses `HashRouter`, requiring **no server rewrites**:

- `/#/` — storybook Home.
- `/#/puzzles` — picture gallery with category filtering.
- `/#/play/:puzzleId` — Three.js puzzle game, optional image hint, mute, restart and completion overlay.
- `/#/parents` — adult-oriented UX gate, preferences, privacy disclosure and an optional third-party support link.

## First visit

The first visit presents a one-time setup for puzzle size (2×2 / 3×3 / 5×5), hints and sound. `usehooks-ts/useLocalStorage` persists these preferences under `little-jigsaw:preferences:v1`. The setup does not reappear unless browser site data is cleared. Parents can change the settings from the parent area.

The library filter uses ephemeral Zustand state. Completed puzzle IDs are stored in `little-jigsaw:completed:v1`; **piece-by-piece in-progress restoration is not yet implemented**.

## Content

The puzzle catalog is defined in `src/content/puzzles.ts`. All bundled images are in `public/assets/puzzles`; audio in `public/assets/audio`. Add a puzzle by committing an image and adding a manifest entry. No backend, account system, CMS or external media hosting is required.

The current three illustration files are first-party SVG assets. The 3D puzzle generator reuses the existing Bézier outline, extruded geometry, raycasting, snap and return-to-tray behavior.

## Architecture

- `src/ui`: React screens, game HUD and storybook CSS.
- `src/state/preferences.ts`: localStorage-backed browser preferences, using **usehooks-ts**.
- `src/state/game-ui.ts`: transient Zustand UI state.
- `src/content/puzzles.ts`: statically bundled catalog.
- `src/domain/puzzle.ts`: renderer-independent puzzle model.
- `src/scene`: ThreeShell simulation/presentation pipeline, Three.js resources, drag/animation operators.
- `packages/core`: existing ThreeShell core source.

## Parent safety

The child-facing game has no ads, purchasing or external navigation. The Parents page uses a **reading challenge only as a UX deterrent**, not secure age verification. The Buy Me a Coffee entry currently points to the provider homepage, **not a configured creator checkout**.

## Pending checks

- Run CI and browser smoke tests with dependencies installed.
- Verify high-piece-count portrait usability.
- Add keyboard/non-drag placement alternatives and robust focus-trapped dialogs.
- Add full in-progress restoration, accessible motion/audio refinements and a real creator donation URL.

## References

- https://github.com/wind198/three-shell-monorepo
- https://github.com/wind198/tutorial__jigsaw-animation
