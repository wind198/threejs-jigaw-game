# Little Jigsaw 3D — Three.js + ThreeShell core runtime

A migration of [tutorial__jigsaw-animation](https://github.com/wind198/tutorial__jigsaw-animation) into a **real 3D tabletop puzzle** with a **fixed, straight-down orthographic camera**. It retains the original 3×3, one-target-per-piece gameplay, seeded puzzle shapes, snap tolerance, return-to-tray behavior, and replay.

## Run

Requires Node.js 22+ and network access to npm packages.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Production build: `npm run build`; domain tests: `npm test`.

## Controls

- Mouse/touch: press a loose piece, drag it over the matching board location, release.
- A piece snaps if released within 34% of its cell size from its own target.
- Unmatched pieces animate back to their original home positions.
- New game resets the board; completion opens a replay modal.

## Architecture

```
src/domain/puzzle.ts                 # deterministic edge generation + puzzle state machine
src/scene/jigsaw.scene.ts            # explicit ThreeShell simulation/presentation pipelines
src/scene/geometry/piece-mesh.ts     # Bezier outline -> extruded mesh + UV mapping
src/scene/resources/                # Three.js resources, artwork, board, cleanup
src/scene/operators/drag.operator.ts # pointer raycasting -> command queue
src/scene/operators/animation.operator.ts # deterministic snap/drop animations
src/scene/state/puzzle-store.ts      # state + mesh registry
src/ui/JigsawGame.tsx                # React host/HUD/replay
packages/core/                     # upstream ThreeShell core source (DI, lifecycle, fixed-step runtime)
```

**Coordinate contract:** `x` points right, `z` points down the board, `y` points upward. The existing 2D-style puzzle geometry `(x,y)` maps to `(x-3, 0, y-3)` in the scene, centered on a 6 × 6 board. Piece mesh shape vertices are oriented with `rotation.x = -PI/2`. The camera is at `(0,18,0)` with `up=(0,0,-1)` and no orbit controls.

## ThreeShell core integration

The application embeds the real `packages/core/src` from
[three-shell-monorepo](https://github.com/wind198/three-shell-monorepo/tree/main/packages/core)
(source snapshot `de486033`), exposed as a local source package for Vite.

- `JigsawSceneModule` registers puzzle state, graphics resources, drag and animation operators, and the scene itself through `@Module`.
- Browser host element and HUD callbacks are explicit bootstrap provider tokens.
- `ThreeApplication.create()` initializes providers, starts the fixed-step runtime, and handles reverse-order lifecycle cleanup on unmount/restart.
- React StrictMode's asynchronous mount/unmount is guarded against stale bootstraps.
- Puzzle mechanics and renderer behavior are unchanged.

The core is independent of Three.js and React. The local copy deliberately uses TypeScript source exports instead of the monorepo's compiled `dist` exports so Vite can consume it without an extra build step.

## Validation

`npm test` uses Node's built-in test runner and works without downloaded packages. UI/Three.js compilation and browser rendering require dependencies and should be tested locally after `npm install`.

## Provenance

The original game was a clean-room focused port. This integration copies the upstream ThreeShell core source and wires its DI/lifecycle into the game:
- https://github.com/wind198/tutorial__jigsaw-animation
- https://github.com/wind198/three-shell-monorepo
