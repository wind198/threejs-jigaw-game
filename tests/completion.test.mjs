import test from 'node:test';
import assert from 'node:assert/strict';
import { puzzles,recommendNextPuzzle,nextPuzzle } from '../src/content/puzzles.ts';
import { PuzzleStore } from '../src/scene/state/puzzle-store.ts';
import { AnimationOperator } from '../src/scene/operators/animation.operator.ts';
import * as THREE from 'three';
test('next puzzle favors unplayed pictures in the same collection',()=>{
 const current=puzzles[0],next=recommendNextPuzzle(current.id,[]);
 assert.notEqual(next.id,current.id);assert.equal(next.category,current.category);
 assert.equal(recommendNextPuzzle(current.id,puzzles.map(p=>p.id)).id,nextPuzzle(current.id).id);
 const completed=puzzles.filter(p=>p.category===current.category).map(p=>p.id);
 assert.ok(!completed.includes(recommendNextPuzzle(current.id,completed).id));
});
test('motion-disabled placement and return transition immediately',()=>{
 const store=new PuzzleStore({size:2,image:'',animationsEnabled:()=>false});
 const animation=new AnimationOperator(store);
 let progress=0,complete=0;store.callbacks={onProgress:n=>{progress=n},onComplete:()=>{complete++}};
 for(const def of store.session.pieces){
  const piece={definition:def,mesh:new THREE.Mesh(),home:new THREE.Vector3(1,2,3),target:new THREE.Vector3(3,2,1)};
  store.session.transition(def.id,'dragging');store.session.transition(def.id,'dropping');animation.begin(piece,false);
  assert.equal(store.session.getState(def.id),'resting');assert.ok(piece.mesh.position.equals(piece.home));
  store.session.transition(def.id,'dragging');store.session.transition(def.id,'snapping');animation.begin(piece,true);
  assert.equal(store.session.getState(def.id),'locked');assert.ok(piece.mesh.position.equals(piece.target));
 }
 assert.equal(progress,4);assert.equal(complete,1);
});
