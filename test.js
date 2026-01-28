import { test } from 'node:test';
import assert from 'node:assert';
import { SortedArray } from './index.ts';

const numCmp = (a, b) => a - b;

test('insert and iterate', () => {
  const arr = new SortedArray(numCmp);
  arr.push(3, 1, 4, 1, 5);
  assert.deepEqual([...arr], [1, 1, 3, 4, 5]);
});

test('delete', () => {
  const arr = new SortedArray(numCmp);
  arr.push(1, 2, 3);
  assert.equal(arr.delete(2), 2);
  assert.deepEqual([...arr], [1, 3]);
});

test('fromArray', () => {
  const arr = SortedArray.fromArray([3, 1, 2], numCmp);
  assert.deepEqual([...arr], [1, 2, 3]);
});

test('upsert', () => {
  const arr = new SortedArray(numCmp);
  assert.equal(arr.upsert(1), true);  // insert
  assert.equal(arr.upsert(1), false); // update
  assert.deepEqual([...arr], [1]);
});

test('for loop iteration', () => {
  const arr = new SortedArray(numCmp);
  arr.push(3, 1, 2);
  const result = [];
  for (const val of arr) {
    result.push(val);
  }
  assert.deepEqual(result, [1, 2, 3]);
});

test('large array operations', () => {
  const arr = new SortedArray(numCmp);
  const nums = Array.from({length: 100}, (_, i) => Math.floor(Math.random() * 1000));
  
  arr.push(...nums);
  const sorted = [...arr];
  
  // Verify sorted order
  for (let i = 1; i < sorted.length; i++) {
    assert(sorted[i] >= sorted[i-1]);
  }
  
  // Test binary search path
  assert.equal(arr.length, nums.length);
  assert(arr.delete(sorted[50]) !== undefined);
  assert.equal(arr.length, nums.length - 1);
});