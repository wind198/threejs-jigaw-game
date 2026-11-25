import test from 'node:test';import assert from 'node:assert/strict';
import {MIN_LOADING_MS,LOADING_FADE_MS,remainingLoadingTime} from '../src/ui/features/play/loading-timing.ts';
test('minimum visible loading interval is 500ms regardless of decode speed',()=>{assert.equal(MIN_LOADING_MS,500);assert.equal(remainingLoadingTime(0),500);assert.equal(remainingLoadingTime(120),380);assert.equal(remainingLoadingTime(500),0);assert.equal(remainingLoadingTime(2000),0);assert.equal(LOADING_FADE_MS,280);});
