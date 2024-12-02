/**
 * Create a scanner function that returns all matched elements from a string
 * @usage stringlist.map(regexScan(/\d+/)); --> list of numbers (as strings)
 * 
 * @param re Regexp
 * @returns Scanning function
 */
export const regexScan = (re: RegExp) => (str: string) => 
    [...str.matchAll(re)].map(m => m[0]);

export const ints = (str: string) => regexScan(/-?\d+/g)(str).map(v => Number(v));

export const countInString = (str: string, re: RegExp|string) => {
    const reg = new RegExp(re, 'g');
    return [...str.matchAll(reg)].length;
}

declare global {

    interface String {
        count(el: string|RegExp): number,
        map<T>(cb: (character: string, index: number) => T): T[],
        log(prefix?: string): this,
    }
}

export const protosString = () => {
    String.prototype.count = function c(re: RegExp|string) { return countInString(this as string, re) };
    String.prototype.map = function map<T>(cb: (character: string, index: number) => T): T[] {
        return (this as string).split('').map(cb);
    }
    String.prototype.log = function log(prefix = '') {
        console.log(prefix, this);
        return this;
    }
}