export type Result<T, E> = {
    ok: true;
    value: T;
} | {
    ok: false;
    error: E;
};
export type CompareFn<T> = (a: T, b: T) => number;
export declare class SortedArray<T> extends Array<T> {
    private compareFn;
    constructor(compareFn: CompareFn<T>);
    private static fromArraySorted;
    static fromArray<T>(arr: T[], compareFn: CompareFn<T>): SortedArray<T>;
    push(...elements: T[]): number;
    pop(): T | undefined;
    clear(): void;
    insert(value: T): boolean;
    deleteAt(idx: number): T | undefined;
    delete(value: T): T | undefined;
    upsert(value: T): boolean;
    private findIndexFor;
}
export declare class DoubleSortedArray<T> {
    private left;
    private right;
    private compareFn;
    constructor(compareFn: CompareFn<T>);
    get length(): number;
    insert(value: T): void;
    private findInsertIndex;
    at(index: number): T | undefined;
    [Symbol.iterator](): Iterator<T>;
    toArray(): T[];
}
