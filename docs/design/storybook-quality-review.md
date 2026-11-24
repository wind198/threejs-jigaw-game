# Storybook first-play and completion
First play asks only for puzzle size, using native radio semantics and the existing preferences. Hint, sound and motion defaults remain in device settings. Native modal dialogs provide focus containment and inert background; Escape is explicitly mapped to leave setup/completion or stay during exit confirmation. No additional play-screen controls. Completion celebrates briefly, offers replay and recommends an unplayed picture from the same collection when possible. OS reduced motion and the parent motion preference suppress both CSS celebration and scene snap/return animation without changing state transitions.
## Quality gates
- 320, 390, 768, 1280 and 1440 CSS-pixel widths, short landscape, safe-area insets.
- First visit: library remains browsable; setup opens only before first puzzle; radio keyboard navigation; cancel and return; preference persistence.
- Completion: focus stays within dialog, Escape behavior, replay, next picture, local collection update.
- Reduced motion: OS and parent preference; snap and failed drop finish correctly.
- Gameplay regression: 4/9/25 pieces, overlap and selection, orientation, no reset/shuffle/count toolbar.
- Verify all static routes, local artwork, contrast and keyboard focus. Canvas placement remains pointer-based; full keyboard puzzle solving is not implemented.
Automated logic tests added. Actual browser screenshots, accessibility audit and final visual score are pending; do not mark these gates passed without evidence.
