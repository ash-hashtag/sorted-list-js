export class SortedArray extends Array {
    constructor(compareFn) {
        super();
        this.compareFn = compareFn;
    }
    static fromArraySorted(arr, compareFn) {
        const s = new SortedArray(compareFn);
        s.push(...arr);
        return s;
    }
    static fromArray(arr, compareFn) {
        return SortedArray.fromArraySorted(arr.sort(compareFn), compareFn);
    }
    push(...elements) {
        for (const el of elements) {
            this.insert(el);
        }
        return this.length;
    }
    pop() {
        return super.pop();
    }
    clear() {
        this.length = 0;
    }
    insert(value) {
        const idx = this.findIndexFor(value);
        super.splice(idx.ok ? idx.value : idx.error, 0, value);
        return true;
    }
    deleteAt(idx) {
        if (idx < this.length) {
            return super.splice(idx, 1)[0];
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
            this[idx.value] = value;
            return false;
        }
        else {
            super.splice(idx.error, 0, value);
            return true;
        }
    }
    findIndexFor(value) {
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
            }
            else if (result < 0) {
                return { ok: false, error: lastIndex + 1 };
            }
        }
        if (length < 8) {
            for (let i = 0; i < length; i++) {
                const result = this.compareFn(this[i], value);
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
            return binarySearchResult(this, value, this.compareFn);
        }
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
export class DoubleSortedArray {
    constructor(compareFn) {
        this.left = [];
        this.right = [];
        this.compareFn = compareFn;
    }
    get length() {
        return this.left.length + this.right.length;
    }
    insert(value) {
        if (this.length === 0) {
            this.right.push(value);
            return;
        }
        const leftLast = this.left[this.left.length - 1];
        const rightFirst = this.right[0];
        if (this.left.length === 0 || this.compareFn(value, rightFirst) >= 0) {
            const idx = this.findInsertIndex(this.right, value);
            this.right.splice(idx, 0, value);
        }
        else if (this.right.length === 0 || this.compareFn(value, leftLast) <= 0) {
            const idx = this.findInsertIndex(this.left, value);
            this.left.splice(idx, 0, value);
        }
        else {
            const distToLeft = this.left.length - this.findInsertIndex(this.left, value);
            const distToRight = this.findInsertIndex(this.right, value);
            if (distToLeft <= distToRight) {
                const idx = this.findInsertIndex(this.left, value);
                this.left.splice(idx, 0, value);
            }
            else {
                const idx = this.findInsertIndex(this.right, value);
                this.right.splice(idx, 0, value);
            }
        }
    }
    findInsertIndex(arr, value) {
        let lo = 0, hi = arr.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (this.compareFn(arr[mid], value) < 0)
                lo = mid + 1;
            else
                hi = mid;
        }
        return lo;
    }
    at(index) {
        if (index < 0 || index >= this.length)
            return undefined;
        return index < this.left.length ? this.left[index] : this.right[index - this.left.length];
    }
    *[Symbol.iterator]() {
        yield* this.left;
        yield* this.right;
    }
    toArray() {
        return [...this.left, ...this.right];
    }
}
