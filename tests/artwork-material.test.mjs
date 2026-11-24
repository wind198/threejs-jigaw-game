import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { generatePieces } from '../src/domain/puzzle.ts';
import { createPieceMesh } from '../src/scene/geometry/piece-mesh.ts';

test('printed faces bypass lighting and tone mapping while wooden edges stay lit',()=>{
 const texture=new THREE.Texture();
 texture.colorSpace=THREE.SRGBColorSpace;
 for(const size of [2,3,5]){
  for(const def of generatePieces(size,size)){
   const mesh=createPieceMesh(def,texture);
   const [face,edge]=mesh.material;
   assert.ok(face instanceof THREE.MeshBasicMaterial);
   assert.equal(face.map,texture);
   assert.equal(face.color.getHex(),0xffffff);
   assert.equal(face.toneMapped,false);
   assert.equal(face.fog,false);
   assert.ok(edge instanceof THREE.MeshStandardMaterial);
   assert.equal(edge.toneMapped,true);
   assert.equal(mesh.castShadow,true);
   assert.equal(mesh.receiveShadow,true);
   assert.ok(mesh.geometry.groups.some(group=>group.materialIndex===0));
   assert.ok(mesh.geometry.groups.some(group=>group.materialIndex===1));
   mesh.geometry.dispose();face.dispose();edge.dispose();
  }
 }
 texture.dispose();
});
