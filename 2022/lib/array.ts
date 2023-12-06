export{}
declare global {
    interface Array<T> {
        sum(): number,
        product(): number,
    }
}
export const sum = <T>(arr: T[]) => arr.reduce((p, v) => p + Number(v), 0);
export const product = <T>(arr: T[]) => arr.reduce((p, v) => p * Number(v), 0);

// Inclusive integer range, ascending or descending
export const range = (from: number, to: number): number[] => from > to ? range(to, from).reverse() :
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

export function* chunk<T>(arr: T[], n: number): Generator<T[], void> {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}