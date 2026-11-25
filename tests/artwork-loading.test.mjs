import test from 'node:test';
import assert from 'node:assert/strict';
import { createPuzzleArtwork, loadPuzzleImage } from '../src/scene/resources/puzzle-art.ts';

test('requested artwork waits for decode before creating a texture, and failures never draw fallback', async () => {
  const originalImage=globalThis.Image, originalDocument=globalThis.document;
  let image, decode, draws=0, gradients=0;
  class MockImage {
    constructor(){image=this;this.naturalWidth=640;this.naturalHeight=480;}
    decode(){return new Promise(resolve=>{decode=resolve;});}
    removeAttribute(){this.src='';}
  }
  globalThis.Image=MockImage;
  globalThis.document={createElement:()=>({getContext:()=>({
    drawImage(){draws++;},createLinearGradient(){gradients++;return {addColorStop(){}};},
    fillRect(){},beginPath(){},arc(){},fill(){}
  })})};
  try {
    const pending=createPuzzleArtwork('/panda.avif');
    assert.equal(draws,0);assert.equal(gradients,0);
    image.onload();
    assert.equal(draws,0);
    decode();
    const texture=await pending;
    assert.equal(draws,1);assert.equal(gradients,0);
    assert.equal(texture.image.width,640);assert.equal(texture.image.height,480);
    texture.dispose();
    const failed=createPuzzleArtwork('/missing.avif');
    image.onerror();
    await assert.rejects(failed,/failed to load/);
    assert.equal(gradients,0);
    const timed=loadPuzzleImage('/hung.avif',undefined,5);
    await assert.rejects(timed,/timed out/);
    const controller=new AbortController();
    const cancelled=loadPuzzleImage('/cancel.avif',controller.signal);
    controller.abort();
    await assert.rejects(cancelled,/cancelled/);
    const sample=await createPuzzleArtwork();
    assert.equal(gradients,1);sample.dispose();
  } finally {globalThis.Image=originalImage;globalThis.document=originalDocument;}
});
