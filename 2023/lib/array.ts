import { tupleSortByKey, tupleValues, zip } from "./tuple.ts";

declare global {

    interface Array<T> {
        sum(): number,
        product(): number,
        tupleSortByKey(): T[],
        tupleValues <V>(): V[];
    }
}

export const protosArray = () => {
    Array.prototype.sum = function s <T>() { return sum(this) }
    Array.prototype.product = function s <T>() { return product(this) }
    Array.prototype.tupleSortByKey = function s <T>() { return tupleSortByKey(this) };
    Array.prototype.tupleValues = function s <V>(): V[] { return tupleValues(this) };
}


export const arrayOfValue = <T>(length: number, value: T): T[] => Array.from({ length }, () => value);

export const sum = <T>(arr: T[]) => arr.reduce((p, v) => p + Number(v), 0);
export const product = <T>(arr: T[]) => arr.reduce((p, v) => p * Number(v), 1);

export const intersect = <T>(a: T[], b: T[]): T[] => a.filter(v => b.includes(v));

// Inclusive integer range, 
export const rangeInclusive = (from: number, to: number): number[] => from > to ? [] :
    Array.from( { length: 1+to-from }, (_, index) => from + index)

// ascending or descending
export const rangeAnyOrder = (from: number, to: number): number[] => from > to ? rangeInclusive(to, from).reverse() :
    Array.from( { length: 1+to-from }, (_, index) => from + index)

export const inRange = (num: number, a: number, b: number) => num <= Math.max(a, b) && num >= Math.min(a, b);

export function findLastIndex(arr: string[], predicate: (s: string) => boolean) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
            return i;
        }
    }
    return -1;
}

export function* genRange(from: number, to: number) {
    while (to --> from) {
       yield to; 
    }
}

export function* chunk<T>(arr: T[], n: number): Generator<T[], void> {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}

export const translateMap = (from: string, to: string): Record<string, string> =>
    Object.fromEntries(zip(from.split(''), to.split('')));

export const translator = <A extends string|number|symbol, B>(map: Record<A, B>) => (el: A): B => map[el] ?? el as unknown as B;

export const countElementsInGroups = (arr: (string|number)[] | string): Record<string|number, number> => {
    if (typeof arr === 'string') {
        arr = arr.split('');
    }
    const countMap: Record<string|number, number> = {};
    for (const e of arr) {
        countMap[e] = 1 + (countMap[e]??0);
    }
    return countMap;
}


// Sort helpers

export const numericDesc = (a: number, b: number) => b - a;
export const numericAsc = (a: number, b: number) => a - b;

export const sortPick = (map: (x: unknown) => string|number, fun: (a: string|number, b: string|number) => number) =>
    (a: unknown, b: unknown) => fun(map(a), map(b));