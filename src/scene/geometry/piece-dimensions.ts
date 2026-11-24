/** Shared vertical dimensions for geometry, tray support and interaction. */
export const PIECE_DEPTH = .08;
export const PIECE_BEVEL = .012;
export const PIECE_HEIGHT = PIECE_DEPTH + 2 * PIECE_BEVEL;
export const CONTACT_GAP = .002;
export const TRAY_CENTER_Y = -.22;
export const TRAY_DEPTH_Y = .09;
export const TRAY_SURFACE_Y = TRAY_CENTER_Y + TRAY_DEPTH_Y / 2;
export const RESTING_Y = TRAY_SURFACE_Y + PIECE_BEVEL + CONTACT_GAP;
// Deliberate visual lift while selected; resting and locked heights remain unchanged.
export const MIN_PICKUP_Y = 1.8;
export const PICKUP_CLEARANCE = .65;
export const LOCKED_Y = .02;
