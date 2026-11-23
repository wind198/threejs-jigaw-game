import test from 'node:test';import assert from 'node:assert/strict';
import {generatePieces,PuzzleSession,shouldSnap} from '../src/domain/puzzle.ts';
test('3x3 puzzle has nine seeded reproducible pieces',()=>{const a=generatePieces(),b=generatePieces();assert.equal(a.length,9);assert.deepEqual(a,b)});
test('neighbors share reverse-compatible internal contour',()=>{const pieces=generatePieces();const a=pieces[0].outline,b=pieces[1].outline;assert.ok(a.length>4);assert.ok(b.length>4);assert.deepEqual(a.slice(1,7), b.slice(-6).reverse().map(s=>s.kind==='line'?{kind:'line',p0:s.p1,p1:s.p0}:{kind:'cubic',p0:s.p3,p1:s.p2,p2:s.p1,p3:s.p0}))});
test('snap tolerance scales with cell size',()=>{assert.equal(shouldSnap({x:0.67,y:0},{x:0,y:0},2),true);assert.equal(shouldSnap({x:.7,y:0},{x:0,y:0},2),false)});
test('session rejects invalid state changes',()=>{const s=new PuzzleSession(generatePieces());assert.throws(()=>s.transition(0,'locked'));s.transition(0,'dragging');s.transition(0,'snapping');s.transition(0,'locked');assert.equal(s.placedCount,1)});
