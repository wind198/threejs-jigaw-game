import { RESTING_Y, PIECE_HEIGHT, CONTACT_GAP } from '../geometry/piece-dimensions';
import type { Slot } from './playroom-layout';
/**
 * Settle a scatter in its existing bottom-to-top order.
 * Conservative footprint bounds avoid intersecting neighboring meshes. Disjoint
 * pieces share the tray surface; only pieces with possible support overlap rise.
 * The footprint is a conservative approximation, not a rigid body simulation.
 */
export function settleStack<T extends { x:number; z:number }>(positions: readonly T[], radius:number): Slot[] {
  const placed:Slot[]=[];
  for(const position of positions){
    let y=RESTING_Y;
    for(const below of placed){
      if(Math.abs(position.x-below.x)<2*radius && Math.abs(position.z-below.z)<2*radius)
        y=Math.max(y,below.y+PIECE_HEIGHT+CONTACT_GAP);
    }
    placed.push({x:position.x,z:position.z,y});
  }
  return placed;
}
