import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayroomLayout,frameLayout,pieceRadius,BOARD_HALF } from '../src/scene/layouts/playroom-layout.ts';
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
  assert.equal(new Set([...slots.values()].map(s=>s.y)).size,ids.length);
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
