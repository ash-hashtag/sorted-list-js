export type Result<T, E> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: E;
};
export type CompareFn<T> = (a: T, b: T) => number;
export declare class SortedArray<T> {
    private inner;
    private compareFn;
    constructor(compareFn: CompareFn<T>);
    private static fromArraySorted;
    static fromArray<T>(arr: T[], compareFn: CompareFn<T>): SortedArray<T>;
    push(...elements: T[]): void;
    pop(): void;
    clear(): void;
    insert(value: T): boolean;
    deleteAt(idx: number): T | undefined;
    delete(value: T): T | undefined;
    upsert(value: T): boolean;
    get length(): number;
    get(index: number): T | undefined;
    private findIndexFor;
    [Symbol.iterator](): Generator<T, void, unknown>;
}
