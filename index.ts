export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export type CompareFn<T> = (a: T, b: T) => number;

export class SortedArray<T> extends Array<T> {
  private compareFn: CompareFn<T>;

  constructor(compareFn: CompareFn<T>) {
    super();
    this.compareFn = compareFn;
  }

  private static fromArraySorted<T>(arr: T[], compareFn: CompareFn<T>) {
    const s = new SortedArray(compareFn);
    s.push(...arr);

    return s;
  }

  static fromArray<T>(arr: T[], compareFn: CompareFn<T>) {
    return SortedArray.fromArraySorted(arr.sort(compareFn), compareFn);
  }

  override push(...elements: T[]) {
    for (const el of elements) {
      this.insert(el);
    }
    return this.length;
  }

  override pop() {
    return super.pop();
  }

  clear() {
    this.length = 0;
  }

  insert(value: T): boolean {
    const idx = this.findIndexFor(value);
    super.splice(idx.ok ? idx.value : idx.error, 0, value);
    return true;
  }

  deleteAt(idx: number): T | undefined {
    if (idx < this.length) {
      return super.splice(idx, 1)[0];
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
      this[idx.value] = value;
      return false;
    } else {
      super.splice(idx.error, 0, value);
      return true;
    }
  }

  private findIndexFor(value: T): Result<number, number> {
    if (this.length == 0) {
      return { ok: false, error: 0 };
    }

    const length = this.length;

    {
      // very common use case is to add at last of the array, hence
      const lastIndex = length - 1;
      const result = this.compareFn(this[lastIndex], value);

      if (result == 0) {
        return { ok: true, value: lastIndex };
      } else if (result < 0) {
        return { ok: false, error: lastIndex + 1 };
      }
    }
    if (length < 8) {
      for (let i = 0; i < length; i++) {
        const result = this.compareFn(this[i], value);
        if (result == 0) {
          return { ok: true, value: i };
        } else if (result > 0) {
          return { ok: false, error: i };
        }
      }
      return { ok: false, error: length };
    } else {
      return binarySearchResult(this, value, this.compareFn);
    }
  }

  first(): T | undefined {
    if (this.length > 0)
      return this[0];
  }

  last(): T | undefined {
    if (this.length > 0)
      return this[this.length - 1];
  }
}

function binarySearchResult<T>(
  arr: readonly T[],
  target: T,
  cmp: CompareFn<T>,
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

function invertCompareFn<T>(c: CompareFn<T>): CompareFn<T> {
  return (a, b) => -c(a, b)
}




export class DoubleSortedArray<T> {
  private left: SortedArray<T>; // stored in reverse order
  private right: SortedArray<T>;
  private compareFn: CompareFn<T>;

  constructor(compareFn: CompareFn<T>) {
    this.compareFn = compareFn;
    this.left = new SortedArray(invertCompareFn(compareFn));
    this.right = new SortedArray(compareFn);
  }

  get length(): number {
    return this.left.length + this.right.length;
  }

  // upsert(value: T): boolean {
  //   if (this.length === 0) {
  //     return this.right.upsert(value);
  //   }

  //   if (this.left.length == 0) {
  //     const rightFirst = this.right.first()!;
  //     if (this.compareFn(value, rightFirst) <= 0) {
  //       return this.left.upsert(value);
  //     } else {
  //       return this.right.upsert(value);
  //     }
      
  //   }

  //   const leftLast = this.left.last()!; // least element

  //   if (this.compareFn(value, leftLast) <= 0) {
  //     return this.left.upsert(value);
  //   }

  //   const leftFirst = this.left.first()!;

  //   if (this.compareFn(value, leftFirst) <= 0) {
  //     return this.left.upsert(value);
  //   } else {
  //     return this.right.upsert(value);
  //   }
  // }


  insert(value: T): boolean {
    if (this.length === 0) {
      return this.right.insert(value);
    }

    if (this.left.length == 0) {
      const rightFirst = this.right.first()!;
      if (this.compareFn(value, rightFirst) <= 0) {
        return this.left.insert(value);
      } else {
        return this.right.insert(value);
      }
      
    }

    const leftLast = this.left.last()!; // least element

    if (this.compareFn(value, leftLast) <= 0) {
      return this.left.insert(value);
    }

    const leftFirst = this.left.first()!;

    if (this.compareFn(value, leftFirst) <= 0) {
      return this.left.insert(value);
    } else {
      return this.right.insert(value);
    }
  }
  


  at(index: number): T | undefined {
    if (index < 0 || index >= this.length) return undefined;
    return index < this.left.length ? this.left[this.left.length - 1 - index] : this.right[index - this.left.length];
  }

  *[Symbol.iterator](): Iterator<T> {
    for (let i = this.left.length - 1; i >= 0; i--) yield this.left[i];
    yield* this.right;
  }


  clear() {
    this.left.clear();
    this.right.clear();
  }

  delete(value: T) {
    this.left.delete(value) || this.right.delete(value);
  }

  deleteAt(index: number): T | undefined {
    if (index < 0 || index >= this.length) return undefined;

    if (index < this.left.length) {
      return this.left.deleteAt(this.left.length - 1 - index);
    } else {
      return this.right.deleteAt(index - this.left.length);
    }
  }

  toArray(): T[] {
    return [...this];
  }
}