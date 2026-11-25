import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('all play routes mount the game entry directly and preserve static metadata',()=>{
 const route=read('app/play/[puzzleId]/page.tsx');
 assert.match(route,/<PlayEntry key=\{puzzle.id\} puzzle=\{puzzle\}/);
 assert.match(route,/generateMetadata/);assert.match(route,/generateStaticParams/);
 assert.doesNotMatch(route,/PuzzleLanding/);
 const entry=read('src/ui/features/play/PlayEntry.tsx');
 assert.match(entry,/<GamePage puzzle=\{puzzle\}/);
 assert.doesNotMatch(entry,/data-play-entry|setPlaying|useState/);
 assert.match(read('src/ui/pages/GamePage.tsx'),/!preferences.setupCompleted/);
});
