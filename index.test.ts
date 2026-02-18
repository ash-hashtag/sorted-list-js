import assert from 'node:assert';
import { test } from 'node:test';
import { DoubleSortedArray, SortedArray } from './index';

const numCmp = (a, b) => a - b;

// SortedArray tests
test('SortedArray: insert and iterate', () => {
  const arr = new SortedArray(numCmp);
  arr.push(3, 1, 4, 1, 5);
  assert.deepEqual([...arr], [1, 1, 3, 4, 5]);
});

test('SortedArray: delete', () => {
  const arr = new SortedArray(numCmp);
  arr.push(1, 2, 3);
  assert.equal(arr.delete(2), 2);
  assert.deepEqual([...arr], [1, 3]);
});

test('SortedArray: fromArray', () => {
  const arr = SortedArray.fromArray([3, 1, 2], numCmp);
  assert.deepEqual([...arr], [1, 2, 3]);
});

test('SortedArray: upsert', () => {
  const arr = new SortedArray(numCmp);
  assert.equal(arr.upsert(1), true);
  assert.equal(arr.upsert(1), false);
  assert.deepEqual([...arr], [1]);
});

test('SortedArray: for loop iteration', () => {
  const arr = new SortedArray(numCmp);
  arr.push(3, 1, 2);
  const result = [];
  for (const val of arr) {
    result.push(val);
  }
  assert.deepEqual(result, [1, 2, 3]);
});

test('SortedArray: large array operations', () => {
  const arr = new SortedArray(numCmp);
  const nums = Array.from({length: 100}, () => Math.floor(Math.random() * 1000));
  
  arr.push(...nums);
  const sorted = [...arr];
  
  for (let i = 1; i < sorted.length; i++) {
    assert(sorted[i] >= sorted[i-1]);
  }
  
  assert.equal(arr.length, nums.length);
  assert(arr.delete(sorted[50]) !== undefined);
  assert.equal(arr.length, nums.length - 1);
});

// DoubleSortedArray tests
test('DoubleSortedArray: basic insertion', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  arr.insert(5);
  arr.insert(3);
  arr.insert(7);
  arr.insert(1);
  arr.insert(9);
  assert.deepEqual(arr.toArray(), [1, 3, 5, 7, 9]);
});

test('DoubleSortedArray: insert at start', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  for (let i = 10; i > 0; i--) arr.insert(i);
  assert.deepEqual(arr.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('DoubleSortedArray: insert at end', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  for (let i = 1; i <= 10; i++) arr.insert(i);
  assert.deepEqual(arr.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('DoubleSortedArray: random insertions', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  [5, 2, 8, 1, 9, 3, 7, 4, 6].forEach(n => arr.insert(n));
  assert.deepEqual(arr.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('DoubleSortedArray: at() method', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  [3, 1, 4, 1, 5].forEach(n => arr.insert(n));
  assert.equal(arr.at(0), 1);
  assert.equal(arr.at(arr.length - 1), 5);
  assert.equal(arr.at(-1), undefined);
  assert.equal(arr.at(100), undefined);
});

test('DoubleSortedArray: iterator', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  [3, 1, 2].forEach(n => arr.insert(n));
  assert.deepEqual([...arr], [1, 2, 3]);
});

test('DoubleSortedArray: length', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  assert.equal(arr.length, 0);
  arr.insert(1);
  assert.equal(arr.length, 1);
  arr.insert(2);
  arr.insert(3);
  assert.equal(arr.length, 3);
});

test('DoubleSortedArray: upsert - insert new values', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  assert.equal(arr.upsert(5), true);
  assert.equal(arr.upsert(3), true);
  assert.equal(arr.upsert(7), true);
  assert.deepEqual(arr.toArray(), [3, 5, 7]);
});

test('DoubleSortedArray: upsert - update existing values', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  arr.upsert(1);
  arr.upsert(2);
  arr.upsert(3);
  assert.equal(arr.upsert(2), false);
  assert.equal(arr.length, 3);
  assert.deepEqual(arr.toArray(), [1, 2, 3]);
});

test('DoubleSortedArray: upsert - mixed operations', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  assert.equal(arr.upsert(5), true);
  assert.equal(arr.upsert(5), false);
  assert.equal(arr.upsert(3), true);
  assert.equal(arr.upsert(7), true);
  assert.equal(arr.upsert(3), false);
  assert.deepEqual(arr.toArray(), [3, 5, 7]);
});

test('DoubleSortedArray: upsert - empty array', () => {
  const arr = new DoubleSortedArray<number>(numCmp);
  assert.equal(arr.upsert(10), true);
  assert.equal(arr.length, 1);
  assert.equal(arr.at(0), 10);
});
