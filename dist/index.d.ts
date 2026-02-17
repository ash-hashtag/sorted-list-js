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
    first(): T | undefined;
    last(): T | undefined;
}
export declare class DoubleSortedArray<T> {
    private left;
    private right;
    private compareFn;
    constructor(compareFn: CompareFn<T>);
    get length(): number;
    insert(value: T): boolean;
    at(index: number): T | undefined;
    [Symbol.iterator](): Iterator<T>;
    clear(): void;
    delete(value: T): void;
    deleteAt(index: number): T | undefined;
    toArray(): T[];
}
