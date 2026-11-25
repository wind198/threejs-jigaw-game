import test from 'node:test';import assert from 'node:assert/strict';
import {createPuzzleArtwork} from '../src/scene/resources/puzzle-art.ts';
import {Container} from '../packages/core/src/container.ts';
import {Module} from '../packages/core/src/di.ts';
test('await source decode, reject missing and aborted images without sample',async()=>{
 const oldImage=globalThis.Image,oldDocument=globalThis.document;let resolve,reject,draws=0,samples=0;
 globalThis.Image=class{naturalWidth=640;naturalHeight=480;decode(){return new Promise((a,b)=>{resolve=a;reject=b;});}removeAttribute(){}};
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({drawImage(){draws++;},createLinearGradient(){samples++;return {addColorStop(){}};},fillRect(){},beginPath(){},arc(){},fill(){}})})};
 try{
  let ready=false;const pending=createPuzzleArtwork('/art.avif').then(t=>{ready=true;return t;});
  await Promise.resolve();assert.equal(ready,false);assert.equal(draws,0);assert.equal(samples,0);
  resolve();const texture=await pending;assert.equal(draws,1);assert.equal(texture.image.width,640);assert.equal(texture.image.height,480);texture.dispose();
  const broken=createPuzzleArtwork('/missing.avif');reject(new Error('decode failed'));await assert.rejects(broken,/failed to load/);
  const controller=new AbortController();const aborted=createPuzzleArtwork('/slow.avif',controller.signal);controller.abort();await assert.rejects(aborted,/failed to load/);assert.equal(samples,0);
  const sample=await createPuzzleArtwork();assert.equal(samples,1);sample.dispose();
 }finally{globalThis.Image=oldImage;globalThis.document=oldDocument;}
});
test('init failure cleans all constructed providers in reverse order',async()=>{
 const events=[];class Root{}
 Module({providers:[{provide:'first',useValue:{onSceneInit(){events.push('init:first')},onSceneDestroy(){events.push('destroy:first')}}},{provide:'fail',useValue:{async onSceneInit(){throw Error('decode failed')},onSceneDestroy(){events.push('destroy:fail')}}},{provide:'later',useValue:{onSceneDestroy(){events.push('destroy:later')}}}]})(Root);
 const c=new Container(Root);await assert.rejects(c.initialize(),/decode failed/);await c.destroy();assert.deepEqual(events,['init:first','destroy:later','destroy:fail','destroy:first']);
});
