import test from 'node:test';import assert from 'node:assert/strict';
import { createPlayroomLayout,pieceRadius } from '../src/scene/layouts/playroom-layout.ts';
import { dropOnTray } from '../src/scene/layouts/drop-layout.ts';
import { RESTING_Y,PIECE_HEIGHT,CONTACT_GAP } from '../src/scene/geometry/piece-dimensions.ts';
import { COMPLETION_AUDIO_DELAY_MS,COMPLETION_DIALOG_DELAY_MS } from '../src/ui/features/play/completion-timing.ts';
for(const size of [2,3,5])for(const aspect of [.5,.8,1.8]){
 test('tray drop stacks and clamps '+size+' '+aspect,()=>{
  const layout=createPlayroomLayout(size,aspect),tray=layout.trays[0],r=pieceRadius(size);
  const first=dropOnTray(layout,tray,r,[]);assert.ok(first);assert.equal(first.y,RESTING_Y);
  const next=dropOnTray(layout,tray,r,[first]);assert.ok(Math.abs(next.y-first.y-PIECE_HEIGHT-CONTACT_GAP)<1e-9);
  assert.equal(next.x,first.x);assert.equal(next.z,first.z);
  const edge=dropOnTray(layout,{x:tray.x+tray.width/2,z:tray.z+tray.depth/2},r,[]);assert.ok(edge);
  assert.ok(Math.abs(edge.x-tray.x)+r<=tray.width/2+1e-9);assert.ok(Math.abs(edge.z-tray.z)+r<=tray.depth/2+1e-9);
  assert.equal(dropOnTray(layout,{x:0,z:0},r,[]),undefined);
  assert.equal(dropOnTray(layout,{x:100,z:100},r,[]),undefined);
 });
}
test('completion timing leaves time to view finished artwork',()=>{assert.ok(COMPLETION_AUDIO_DELAY_MS>0);assert.ok(COMPLETION_DIALOG_DELAY_MS>=3000);assert.ok(COMPLETION_DIALOG_DELAY_MS>COMPLETION_AUDIO_DELAY_MS);});
