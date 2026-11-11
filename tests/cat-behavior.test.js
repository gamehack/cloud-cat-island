import test from 'node:test';import assert from 'node:assert/strict';import {createCat,tick,interact,STATES} from '../src/cat-behavior.js';
test('initial state is resting',()=>{const c=createCat('a',0,0);assert.equal(c.state,STATES.REST)});
test('same seed yields deterministic motion',()=>{const a=createCat('a',0,0,42),b=createCat('b',0,0,42);for(let i=0;i<1000;i++){tick(a,i/10,.1);tick(b,i/10,.1)}assert.equal(a.x,b.x);assert.equal(a.z,b.z);assert.equal(a.state,b.state)});
test('cat stays inside island',()=>{const c=createCat('a',0,0,5);for(let i=0;i<3000;i++){tick(c,i/10,.1);assert.ok(Math.abs(c.x)<=12.001);assert.ok(Math.abs(c.z)<=12.001)}});
test('petting produces temporary watch state',()=>{const c=createCat('a',0,0);interact(c,10);tick(c,11,.1);assert.equal(c.state,STATES.WATCH);assert.equal(c.until,13)});
test('negative delta rejected',()=>assert.throws(()=>tick(createCat('a',0,0),1,-1),RangeError));
