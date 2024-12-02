import { transposeMatrix } from "./matrix.ts";
import { tupleSortByKey, tupleValues, zip } from "./tuple.ts";

declare global {

    interface Array<T> {
        sum(): number,
        product(): number,
        count(el: T): number,
        tupleSortByKey(): T[],
        tupleValues <V>(): V[];
        tableColumns <TCell>(this: TCell[][]): TCell[][];
    }
}

export const protosArray = () => {
    Array.prototype.sum = function s <T>() { return sum(this) }
    Array.prototype.product = function s <T>() { return product(this) }
    Array.prototype.count = function s <T>(val: T) { return this.filter(v => v === val).length }
    Array.prototype.tupleSortByKey = function s <T>() { return tupleSortByKey(this) };
    Array.prototype.tupleValues = function s <V>(): V[] { return tupleValues(this) };

    Array.prototype.tableColumns = function s <TCell>(this: TCell[][]): TCell[][] { return transposeMatrix<TCell>(this) };
}


export const arrayOfValue = <T>(length: number, value: T): T[] => Array.from({ length }, () => value);

export const sum = <T>(arr: T[]) => arr.reduce((p, v) => p + Number(v), 0);
export const product = <T>(arr: T[]) => arr.reduce((p, v) => p * Number(v), 1);

export const intersect = <T>(a: T[], b: T[]): T[] => a.filter(v => b.includes(v));

// Inclusive integer range, 
export const rangeInclusive = (from: number, to: number): number[] => from > to ? [] :
    Array.from( { length: 1+to-from }, (_, index) => from + index)

export const rangeExclusive = (from: number, to: number): number[] => from > to ? [] :
    Array.from( { length: to-from }, (_, index) => from + index)

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

export const frequencyMap = countElementsInGroups;

// Sort helpers
export const sortCompareNumericDesc = (a: number, b: number) => b - a;
export const sortCompareNumericAsc = (a: number, b: number) => a - b;



export function arrayMode(arr: (string|number)[]) {
    const frequency: Record<string|number, number> = {};
    let maxFreq = 0;
    const mode = [];
  
    // Count occurrences
    arr.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
      }
    });
  
    // Find the mode(s)
    for (const key in frequency) {
      if (frequency[key] === maxFreq) {
        mode.push(key); // Convert key back to a number
      }
    }
  
    return mode.length === arr.length ? [] : mode; // If all values occur equally, no mode
  }