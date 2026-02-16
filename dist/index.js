export class SortedArray {
    constructor(compareFn) {
        this.inner = [];
        this.compareFn = compareFn;
    }
    static fromArraySorted(arr, compareFn) {
        const s = new SortedArray(compareFn);
        s.inner = arr;
        return s;
    }
    static fromArray(arr, compareFn) {
        return SortedArray.fromArraySorted(arr.sort(compareFn), compareFn);
    }
    push(...elements) {
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
    insert(value) {
        const idx = this.findIndexFor(value);
        if (idx.ok) {
            this.inner.splice(idx.value, 0, value);
            return true;
        }
        else {
            this.inner.splice(idx.error, 0, value);
            return true;
        }
    }
    deleteAt(idx) {
        if (idx < this.inner.length) {
            return this.inner.splice(idx, 1)[0];
        }
        return undefined;
    }
    delete(value) {
        const idx = this.findIndexFor(value);
        if (idx.ok) {
            return this.deleteAt(idx.value);
        }
        return undefined;
    }
    upsert(value) {
        const idx = this.findIndexFor(value);
        if (idx.ok) {
            this.inner[idx.value] = value;
            return false;
        }
        else {
            this.inner.splice(idx.error, 0, value);
            return true;
        }
    }
    get length() {
        return this.inner.length;
    }
    get(index) {
        return this.inner[index];
    }
    findIndexFor(value) {
        if (this.inner.length == 0) {
            return { ok: false, error: 0 };
        }
        const length = this.inner.length;
        {
            // very common use case is to add at last of the array, hence
            const lastIndex = length - 1;
            const result = this.compareFn(this.inner[lastIndex], value);
            if (result == 0) {
                return { ok: true, value: lastIndex };
            }
            else if (result < 0) {
                return { ok: false, error: lastIndex + 1 };
            }
        }
        if (length < 8) {
            for (let i = 0; i < length; i++) {
                const result = this.compareFn(this.inner[i], value);
                if (result == 0) {
                    return { ok: true, value: i };
                }
                else if (result > 0) {
                    return { ok: false, error: i };
                }
            }
            return { ok: false, error: length };
        }
        else {
            return binarySearchResult(this.inner, value, this.compareFn);
        }
    }
    *[Symbol.iterator]() {
        yield* this.inner;
    }
}
function binarySearchResult(arr, target, cmp) {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        const c = cmp(arr[mid], target);
        if (c < 0)
            lo = mid + 1;
        else
            hi = mid;
    }
    // lo === lower_bound
    if (lo < arr.length && cmp(arr[lo], target) === 0) {
        return { ok: true, value: lo }; // found
    }
    return { ok: false, error: lo }; // not found → insert position
}
