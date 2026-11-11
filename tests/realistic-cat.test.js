import test from 'node:test';import assert from 'node:assert/strict';import {pickClip} from '../src/realistic-cat.js';
test('walk state selects matching animation',()=>{const clips=[{name:'Idle'},{name:'Walk'}];assert.equal(pickClip(clips,'walk'),clips[1]);assert.equal(pickClip(clips,'rest'),clips[0]);});
test('missing clips produce no animation',()=>assert.equal(pickClip([],'groom'),null));
test('case insensitive matching',()=>assert.equal(pickClip([{name:'CAT_SLEEP'}],'rest').name,'CAT_SLEEP'));
