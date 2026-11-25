import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { presentPreparedPieces } from '../src/scene/resources/piece-presentation.ts';
function fixture(){
 const artwork=new THREE.Texture(),scene=new THREE.Scene(),camera=new THREE.Camera(),events=[];
 const pieces=Array.from({length:4},()=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(),[new THREE.MeshBasicMaterial({map:artwork}),new THREE.MeshStandardMaterial()]);mesh.visible=false;scene.add(mesh);return {mesh};});
 const renderer={getContext:()=>({isContextLost:()=>false}),initTexture(t){assert.equal(t,artwork);assert.ok(pieces.every(p=>!p.mesh.visible));events.push('upload');},compile(){assert.ok(pieces.every(p=>p.mesh.visible));events.push('compile');},render(){assert.ok(pieces.every(p=>p.mesh.visible));events.push('render');}};
 return {artwork,scene,camera,events,pieces,renderer};
}
test('all pieces upload and render in one transaction before readiness',()=>{const f=fixture();presentPreparedPieces(f.renderer,f.scene,f.camera,f.artwork,f.pieces,4,()=>f.events.push('intro'));assert.deepEqual(f.events,['upload','compile','intro','render']);});
test('reject incomplete pieces before uploading or revealing',()=>{const f=fixture();assert.throws(()=>presentPreparedPieces(f.renderer,f.scene,f.camera,f.artwork,f.pieces,5,()=>{}),/Incomplete/);assert.deepEqual(f.events,[]);assert.ok(f.pieces.every(p=>!p.mesh.visible));});
test('failed upload or rendering hides every piece',()=>{for(const step of ['initTexture','render']){const f=fixture();f.renderer[step]=()=>{throw Error('GPU failure')};assert.throws(()=>presentPreparedPieces(f.renderer,f.scene,f.camera,f.artwork,f.pieces,4,()=>{}),/GPU failure/);assert.ok(f.pieces.every(p=>!p.mesh.visible));}});
