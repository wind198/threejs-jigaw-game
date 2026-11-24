import { RESTING_Y, PIECE_HEIGHT, CONTACT_GAP } from '../geometry/piece-dimensions';
import type { PlayroomLayout, Slot } from './playroom-layout';
/** Loose pieces can be rearranged on trays, not left obstructing the board. */
export function dropOnTray(layout:PlayroomLayout,position:{x:number;z:number},radius:number,supports:readonly Slot[]):Slot|undefined {
  const tray=layout.trays.find(t=>Math.abs(position.x-t.x)<=t.width/2 && Math.abs(position.z-t.z)<=t.depth/2);
  if(!tray)return undefined;
  const xSpan=Math.max(0,tray.width/2-radius),zSpan=Math.max(0,tray.depth/2-radius);
  const x=tray.x+Math.max(-xSpan,Math.min(xSpan,position.x-tray.x));
  const z=tray.z+Math.max(-zSpan,Math.min(zSpan,position.z-tray.z));
  let y=RESTING_Y;
  for(const below of supports){
    if(Math.abs(x-below.x)<2*radius&&Math.abs(z-below.z)<2*radius)y=Math.max(y,below.y+PIECE_HEIGHT+CONTACT_GAP);
  }
  return {x,z,y};
}
