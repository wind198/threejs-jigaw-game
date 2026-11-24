import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizePreferences} from '../src/state/preferences.ts';
import {AUDIO_CATALOG} from '../src/audio/audio.catalog.ts';
test('legacy mute is preserved and new settings default safely',()=>{const p=normalizePreferences({schemaVersion:1,soundEnabled:false});assert.equal(p.soundEnabled,false);assert.equal(p.musicVolume,.25);assert.equal(p.effectsEnabled,true);});
test('volume bounds and invalid values',()=>{const p=normalizePreferences({schemaVersion:1,musicVolume:2,effectsVolume:-1});assert.equal(p.musicVolume,1);assert.equal(p.effectsVolume,0);assert.equal(normalizePreferences({schemaVersion:1,musicVolume:NaN}).musicVolume,.25);});
test('unapproved assets have no placeholder urls',()=>{assert.equal(AUDIO_CATALOG.music.browsing,null);assert.equal(AUDIO_CATALOG.music.playing,null);assert.equal(AUDIO_CATALOG.success,null);});
