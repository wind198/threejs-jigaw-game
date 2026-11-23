# Jigsaw 3D design

## Intent

Migrate the existing 3×3 toddler jigsaw experience from Phaser into Three.js, without introducing 3D camera controls or physics. Improve the sense of physical pieces with extrusion, bevel, directional shadows, lift/drop animation and a wooden board.

## Constraints

- Camera is **orthographic, vertical**, and fixed.
- Puzzle lives on XZ; Y is height.
- Pointer selection is raycast-based; movement intersects a horizontal plane.
- Retain deterministic edge generation, one-target snapping and undoable invalid drop.
- Own renderer/material/geometry/event lifetimes in the scene, not React.
- UI is a React overlay, not rendered per frame.

## Approaches

1. **Recommended: ThreeShell-style imperative scene runtime with declarative execution pipeline.** Retains a single fixed-step scheduler and keeps React lifecycle-only.
2. React Three Fiber components. Better React composition, but loses direct mapping to the existing ThreeShell scene/operator framework.
3. Full 3D physics. Unnecessary for a flat puzzle; adds complexity and unstable snap behavior.

## Standalone handoff decision

The deliverable contains a compatible runtime subset because upstream repositories were accessible for inspection but not cloneable; full upstream DI integration is explicitly documented as a follow-up. A simplified complementary-edge generator is retained for a self-contained runnable example.

## Acceptance

- Nine extruded pieces are generated from deterministic Bezier contours.
- Raycasting handles mouse/touch picking and plane dragging.
- Valid drops snap to individual target, invalid drops return home.
- Locked pieces are no longer pickable; completion shows replay.
- Scene disposal removes event listeners and GPU resources.
