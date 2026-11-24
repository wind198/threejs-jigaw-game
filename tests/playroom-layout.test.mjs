import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayroomLayout,frameLayout,pieceRadius,BOARD_HALF } from '../src/scene/layouts/playroom-layout.ts';
import { RESTING_Y, PIECE_HEIGHT, CONTACT_GAP } from '../src/scene/geometry/piece-dimensions.ts';
import { settleStack } from '../src/scene/layouts/stack-layout.ts';
import { scatterPieces } from '../src/scene/layouts/scatter-layout.ts';
for(const size of [2,3,5])for(const aspect of [.5,.6,.8,1.19,1.2,1.8,3]){
 test('all pieces fit size '+size+' at aspect '+aspect,()=>{
  const layout=createPlayroomLayout(size,aspect),frame=frameLayout(layout,aspect),r=pieceRadius(size);
  const ids=Array.from({length:size*size},(_,i)=>i),slots=scatterPieces(layout,size,ids,2026);
  assert.equal(slots.size,ids.length);
  assert.ok(Math.abs(frame.width/frame.height-aspect)<1e-9);
  assert.ok(frame.height/2-Math.abs(frame.centerZ)>=BOARD_HALF-1e-9);
  for(const slot of slots.values()){
   assert.ok(Math.abs(slot.x)+r<=frame.width/2+1e-9);
   assert.ok(Math.abs(slot.z-frame.centerZ)+r<=frame.height/2+1e-9);
   assert.ok(Math.abs(slot.x)-r>=BOARD_HALF-1e-9||Math.abs(slot.z)-r>=BOARD_HALF-1e-9);
  }
  const values=[...slots.values()];
  assert.ok(values.some(s=>s.y===RESTING_Y));
  for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++){
   const a=values[i],b=values[j];
   if(Math.abs(a.x-b.x)<2*r&&Math.abs(a.z-b.z)<2*r)assert.ok(b.y-a.y>=PIECE_HEIGHT+CONTACT_GAP-1e-9);
  }
 });
}
test('board-first framing uses at least 95% of canvas width on tall portrait',()=>{
 for(const size of [2,3,5])assert.ok(2*BOARD_HALF/createPlayroomLayout(size,.5).width>=.95);
});
test('scatter is seeded, shuffle changes assignment, no input mutation',()=>{
 const layout=createPlayroomLayout(5,.6),ids=Array.from({length:25},(_,i)=>i);
 assert.deepEqual(scatterPieces(layout,5,ids,2026),scatterPieces(layout,5,ids,2026));
 assert.notDeepEqual(scatterPieces(layout,5,ids,2026),scatterPieces(layout,5,ids,2027));
 assert.deepEqual(ids,Array.from({length:25},(_,i)=>i));
});

test('disjoint pieces rest on the tray, overlapping pieces stack and settle after removal',()=>{
 const positions=[{x:0,z:0},{x:4,z:0},{x:.5,z:0},{x:1,z:0}];
 const slots=settleStack(positions,1);
 assert.equal(slots[0].y,RESTING_Y);assert.equal(slots[1].y,RESTING_Y);
 assert.ok(Math.abs(slots[2].y-RESTING_Y-PIECE_HEIGHT-CONTACT_GAP)<1e-9);
 assert.ok(slots[3].y>slots[2].y);
 const remaining=settleStack(positions.slice(1),1);
 assert.equal(remaining[1].y,RESTING_Y);
 assert.deepEqual(remaining.map(({x,z})=>({x,z})),positions.slice(1));
});
