# Little Jigsaw 3D — Three.js + ThreeShell-style runtime

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
vendor/three-shell-core/            # embedded minimal fixed-step runtime adapter
```

**Coordinate contract:** `x` points right, `z` points down the board, `y` points upward. The existing 2D-style puzzle geometry `(x,y)` maps to `(x-3, 0, y-3)` in the scene, centered on a 6 × 6 board. Piece mesh shape vertices are oriented with `rotation.x = -PI/2`. The camera is at `(0,18,0)` with `up=(0,0,-1)` and no orbit controls.

## Integration with the upstream ThreeShell monorepo

This zip is **a standalone port**, not a byte-for-byte checkout of either upstream repository. Network restrictions prevented cloning and installing packages in the authoring environment. The included `vendor/three-shell-core` is a **small source-compatible subset** of the fixed-step `ThreeShell`/`SimulationRuntime`/`ThreeApplication` interfaces used here. It does **not** include upstream module decorators, constructor DI, auto discovery, or the Next.js adapter. `jigsaw.module.ts` is a composition descriptor, not an upstream decorated `@Module`.

To integrate into [three-shell-monorepo](https://github.com/wind198/three-shell-monorepo):
1. Move `src/scene`, `src/domain` and `src/ui` into an application under `apps/`.
2. Replace the local vendor dependency with `@three-shell/core: workspace:*`.
3. Adapt `JigsawScene` to upstream `ThreeApplication.create()` and `@Module` constructor providers; inject the host element and HUD callbacks through explicit tokens in `jigsaw.mount.ts`.
4. Reuse `@three-shell/next` auto registry and its generated `<SceneView scene="jigsaw" />` to mount the scene in Next.js.
5. Replace the simplified edge profile in `src/domain/puzzle.ts` with the full upstream `features/jigsaw/geometry` module if exact legacy contour/preset parity is required. The current generator preserves seeded complementary edges but intentionally implements a lighter default profile.

## Validation

`npm test` uses Node's built-in test runner and works without downloaded packages. UI/Three.js compilation and browser rendering require dependencies and should be tested locally after `npm install`.

## Provenance

This is a clean-room focused port informed by the two public repositories:
- https://github.com/wind198/tutorial__jigsaw-animation
- https://github.com/wind198/three-shell-monorepo
