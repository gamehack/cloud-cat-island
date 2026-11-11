import test from 'node:test';import assert from 'node:assert/strict';import {loadProgress,saveProgress,timeOfDay} from '../src/island-features.js';
function storage(){const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)}}
test('progress survives revisit',()=>{const s=storage();const p=loadProgress(s);p.seen=['橘子'];p.pets=2;saveProgress(p,s);assert.deepEqual(loadProgress(s).seen,['橘子']);assert.equal(loadProgress(s).pets,2)});
test('corrupt progress resets safely',()=>{const s=storage();s.setItem('cloud-cat-island-progress-v1','{');assert.equal(loadProgress(s).pets,0)});
test('time of day has four phases',()=>{for(const [h,phase] of [[3,'night'],[7,'morning'],[12,'day'],[18,'evening'],[21,'night']])assert.equal(timeOfDay(new Date(2026,0,1,h)),phase)});
