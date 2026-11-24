export type Slot = { x:number; z:number; y:number };
export type Tray = { x:number; z:number; width:number; depth:number };
export type PlayroomLayout = { mode:'landscape'|'portrait'; width:number; depth:number; centerZ:number; trays:Tray[] };
export const BOARD_HALF = 3.15;
export function pieceRadius(size:number) { return 6/size*.76+.02; }
/** Allocate the board first, reserving only enough tray depth to fit a single piece at minimum. */
export function createPlayroomLayout(size:number, aspect:number):PlayroomLayout {
  const r=pieceRadius(size), margin=.12, gap=.12, board=2*BOARD_HALF;
  if(aspect<1.2){
    const minTray=2*r+.16;
    const depth=Math.max(board+2*margin+gap+minTray,(board+2*margin)/aspect);
    const width=depth*aspect;
    const top=-BOARD_HALF-margin;
    const trayTop=BOARD_HALF+gap, bottom=top+depth-margin;
    return {mode:'portrait',width,depth,centerZ:top+depth/2,trays:[{x:0,z:(trayTop+bottom)/2,width:width-2*margin,depth:bottom-trayTop}]};
  }
  const minSide=2*r+.16;
  const width=Math.max(board+2*(gap+margin+minSide),(board+2*margin)*aspect);
  const depth=width/aspect;
  const sideWidth=(width-board)/2-gap-margin;
  const x=BOARD_HALF+gap+sideWidth/2;
  return {mode:'landscape',width,depth,centerZ:0,trays:[{x:-x,z:0,width:sideWidth,depth:depth-2*margin},{x,z:0,width:sideWidth,depth:depth-2*margin}]};
}
export function frameLayout(layout:PlayroomLayout,aspect:number) {
  const height=Math.max(layout.depth,layout.width/aspect);
  return {width:height*aspect,height,centerZ:layout.centerZ};
}
