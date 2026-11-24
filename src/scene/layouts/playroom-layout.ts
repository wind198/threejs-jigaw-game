export type Slot = { x: number; z: number };
export type Tray = { x: number; z: number; width: number; depth: number };
export type PlayroomLayout = { mode: 'landscape' | 'portrait'; width: number; depth: number; centerZ: number; slots: Slot[]; trays: Tray[]; capacity: number };
/** Board coordinates stay fixed. Slot spacing accounts for the 26% jigsaw tabs on both edges. */
export function createPlayroomLayout(size: number, aspect: number): PlayroomLayout {
  const pitch = 6 / size * 1.57;
  const portrait = aspect < 1.2;
  if (portrait) {
    const columns = Math.max(2, Math.floor(7.2 / pitch));
    const rows = size === 2 ? 1 : 2;
    const width = Math.max(7.6, columns * pitch + .4);
    const trayDepth = rows * pitch + .4;
    const trayZ = 3.55 + trayDepth / 2;
    const slots = Array.from({length:columns * rows}, (_, i) => ({x:(i % columns - (columns - 1) / 2) * pitch,z:trayZ + (Math.floor(i / columns) - (rows - 1) / 2) * pitch}));
    const top = -3.65, bottom = trayZ + trayDepth / 2 + .3;
    return {mode:'portrait',width,depth:bottom-top,centerZ:(bottom+top)/2,slots,trays:[{x:0,z:trayZ,width:width-.2,depth:trayDepth}],capacity:slots.length};
  }
  const columns = size === 2 ? 1 : 2;
  const rows = Math.max(2,Math.ceil(size * size / (2 * columns)));
  const trayWidth = columns * pitch + .4, trayDepth = rows * pitch + .4;
  const offset = 3.55 + trayWidth / 2;
  const slots = Array.from({length:2 * columns * rows},(_,i)=>{
    const side = i % 2 === 0 ? -1 : 1, ordinal = Math.floor(i / 2);
    return {x:side * (offset + (ordinal % columns - (columns - 1)/2)*pitch),z:(Math.floor(ordinal/columns)-(rows-1)/2)*pitch};
  });
  return {mode:'landscape',width:2*(offset+trayWidth/2)+.4,depth:Math.max(7.4,trayDepth+.5),centerZ:0,slots,trays:[{x:-offset,z:0,width:trayWidth,depth:trayDepth},{x:offset,z:0,width:trayWidth,depth:trayDepth}],capacity:slots.length};
}
export function frameLayout(layout: PlayroomLayout, aspect: number) {
  const height = Math.max(layout.depth,layout.width / aspect);
  return {width:height*aspect,height,centerZ:layout.centerZ};
}
export function trayPageCount(remaining: number, capacity: number) { return Math.max(1, Math.ceil(remaining / capacity)); }
export function clampTrayPage(page: number, remaining: number, capacity: number) { return Math.max(0, Math.min(page, trayPageCount(remaining,capacity)-1)); }
