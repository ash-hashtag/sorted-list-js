export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export type CompareFn<T> = (a: T, b: T) => number;

export class SortedArray<T> {
  private inner: T[];
  private compareFn: CompareFn<T>;

  constructor(compareFn: CompareFn<T>) {
    this.inner = [];
    this.compareFn = compareFn;
  }

  private static fromArraySorted<T>(arr: T[], compareFn: CompareFn<T>) {
    const s = new SortedArray(compareFn);
    s.inner = arr;

    return s;
  }

  static fromArray<T>(arr: T[], compareFn: CompareFn<T>) {
    return SortedArray.fromArraySorted(
      arr.sort(compareFn),
      compareFn,
    );
  }

  push(...elements: T[]) {
    for (const el of elements) {
      this.insert(el);
    }
  }

  pop() {
    this.inner.pop();
  }

  clear() {
    this.inner.length = 0;
  }

  insert(value: T): boolean {
    const idx = this.findIndexFor(value);

    if (idx.ok) {
      this.inner.splice(idx.value, 0, value);
      return true;
    } else {
      this.inner.splice(idx.error, 0, value);
      return true;
    }
  }

  deleteAt(idx: number): T | undefined {
    if (idx < this.inner.length) {
      return this.inner.splice(idx, 1)[0];
    }

    return undefined;
  }

  delete(value: T): T | undefined {
    const idx = this.findIndexFor(value);
    if (idx.ok) {
      return this.deleteAt(idx.value);
    }
    return undefined;
  }

  upsert(value: T): boolean {
    const idx = this.findIndexFor(value);
    if (idx.ok) {
      this.inner[idx.value] = value;
      return false;
    } else {
      this.inner.splice(idx.error, 0, value);
      return true;
    }
  }

  get length() {
    return this.inner.length;
  }

  get(index: number): T | undefined {
    return this.inner[index];
  }

  private findIndexFor(value: T): Result<number, number> {
    if (this.inner.length < 8) {
      for (let i = 0; i < this.inner.length; i++) {
        const result = this.compareFn(this.inner[i], value);
        if (result == 0) {
          return { ok: true, value: i };
        } else if (result > 0) {
          return { ok: false, error: i };
        }
      }
      return { ok: false, error: this.inner.length };
    } else {
      return binarySearchResult(this.inner, value, this.compareFn);
    }
  }

  *[Symbol.iterator]() {
    yield* this.inner;
  }
}

function binarySearchResult<T>(
  arr: readonly T[],
  target: T,
  cmp: (a: T, b: T) => number,
): Result<number, number> {
  let lo = 0;
  let hi = arr.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const c = cmp(arr[mid], target);

    if (c < 0) lo = mid + 1;
    else hi = mid;
  }

  // lo === lower_bound
  if (lo < arr.length && cmp(arr[lo], target) === 0) {
    return { ok: true, value: lo }; // found
  }

  return { ok: false, error: lo }; // not found → insert position
}
