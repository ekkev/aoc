export const regexScan = (re: RegExp) => (str: string) => 
    [...str.matchAll(re)].map(m => m[0]);

export const ints = (str: string) => regexScan(/-?\d+/g)(str).map(v => Number(v));