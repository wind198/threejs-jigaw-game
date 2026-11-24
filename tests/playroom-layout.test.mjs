import test from 'node:test';
import assert from 'node:assert/strict';
import { createPlayroomLayout,frameLayout,trayPageCount,clampTrayPage } from '../src/scene/layouts/playroom-layout.ts';
for(const size of [2,3,5])for(const aspect of [.5,.8,1.19,1.2,1.8,3]){
 test('layout fits size '+size+' at aspect '+aspect,()=>{
  const layout=createPlayroomLayout(size,aspect),frame=frameLayout(layout,aspect),radius=6/size*.76+.02;
  assert.equal(layout.mode,aspect<1.2?'portrait':'landscape');
  assert.ok(frame.width>=layout.width-1e-9);
  assert.ok(frame.height>=layout.depth-1e-9);
  assert.ok(Math.abs(frame.width/frame.height-aspect)<1e-9);
  assert.ok(layout.capacity>0);
  assert.ok(frame.height/2-Math.abs(frame.centerZ)>=3.35-1e-9);
  for(const slot of layout.slots){
   assert.ok(Math.abs(slot.x)+radius<=frame.width/2);
   assert.ok(Math.abs(slot.z-frame.centerZ)+radius<=frame.height/2);
   assert.ok(Math.abs(slot.x)-radius>=3.35||Math.abs(slot.z)-radius>=3.35);
  }
  for(let i=0;i<layout.slots.length;i++)for(let j=i+1;j<layout.slots.length;j++){
   const a=layout.slots[i],b=layout.slots[j];
   assert.ok(Math.abs(a.x-b.x)>=2*radius-1e-9||Math.abs(a.z-b.z)>=2*radius-1e-9);
  }
 });
}
test('portrait increases board scale relative to original 18-unit width',()=>{
 const f=frameLayout(createPlayroomLayout(5,.6),.6);
 assert.ok(f.width<12);
});
test('page clamp handles depletion and empty tray',()=>{
 assert.equal(trayPageCount(25,6),5);
 assert.equal(clampTrayPage(4,4,6),0);
 assert.equal(clampTrayPage(-1,25,6),0);
 assert.equal(trayPageCount(0,6),1);
});
