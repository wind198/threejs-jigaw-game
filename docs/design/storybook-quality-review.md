# Storybook first-play and completion
First play asks only for puzzle size, using native radio semantics and the existing preferences. Hint, sound and motion defaults remain in device settings. Native modal dialogs provide focus containment and inert background; Escape is explicitly mapped to leave setup/completion or stay during exit confirmation. No additional play-screen controls. Completion is graphic-first: a large celebration star, completed artwork, and three equal-width action tiles (Pictures, Again, Next). Each tile uses a 40px icon over an 11px supporting label, with a 96px minimum height (88px in short landscape). Next is the green primary action and recommends an unplayed picture from the same collection when possible. Accessible names retain full action descriptions. OS reduced motion and the parent motion preference suppress both CSS celebration and scene snap/return animation without changing state transitions.
## Quality gates
- 320, 390, 768, 1280 and 1440 CSS-pixel widths, short landscape, safe-area insets.
- First visit: library remains browsable; setup opens only before first puzzle; radio keyboard navigation; cancel and return; preference persistence.
- Completion: focus stays within dialog, Escape behavior, replay, next picture, local collection update; check that icons dominate labels, three tiles fit at 320px, and all actions remain reachable in short landscape.
- Reduced motion: OS and parent preference; snap and failed drop finish correctly.
- Gameplay regression: 4/9/25 pieces, overlap and selection, orientation, no reset/shuffle/count toolbar.
- Verify all static routes, local artwork, contrast and keyboard focus. Canvas placement remains pointer-based; full keyboard puzzle solving is not implemented.
Automated logic tests added. Actual browser screenshots, accessibility audit and final visual score are pending; do not mark these gates passed without evidence.
