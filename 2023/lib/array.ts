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