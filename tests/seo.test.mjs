import test from 'node:test';import assert from 'node:assert/strict';
import { parseSiteUrl } from '../src/seo/site.ts';
import { indexablePages,puzzleTitle } from '../src/seo/catalog.ts';
import { puzzles } from '../src/content/puzzles.ts';
test('canonical origin is optional but validated',()=>{assert.equal(parseSiteUrl(undefined),undefined);assert.equal(parseSiteUrl('https://puzzles.test.invalid/').origin,'https://puzzles.test.invalid');for(const url of ['http://localhost','https://example.com','https://foo.example/path','https://host.test/path'])assert.throws(()=>parseSiteUrl(url));});
test('sitemap covers each puzzle with unique paths and excludes parent settings',()=>{const entries=indexablePages();assert.equal(entries.length,puzzles.length+6);assert.equal(new Set(entries.map(e=>e.path)).size,entries.length);assert.ok(!entries.some(e=>e.path==='/parents/'));for(const p of puzzles){assert.ok(entries.some(e=>e.path==='/play/'+p.id+'/'&&e.image===p.image));assert.ok(puzzleTitle(p).includes(p.title));}});
