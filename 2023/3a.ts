import { readAllLines } from "./lib/file.ts";

const lines = readAllLines('3.in');
const isSymbol = (v: string|undefined) => {
    if (v === undefined) { return false; }
    if (!isNaN(Number(v))) { return false; }
    if (v === '.') { return false}
    return true;
}

const anySymbol = (str: string) => {
    return str.split('').some(isSymbol)
}

let result = 0;
for (const [y, line] of lines.entries()) {
    const m = line.matchAll(/(\d+)/g);
    for (const z of m) {
        const xl = z.index! - 1;
        const xr = z.index! + z[1].length;
        if (isSymbol(lines[y][xl]) || isSymbol(lines[y][xr])
            || (lines[y-1] && anySymbol(lines[y-1].substring(xl, xr+1)))
            || (lines[y+1] && anySymbol(lines[y+1].substring(xl, xr+1)))) {
            result += Number(z[1]);
        }
    }
}

console.log({result}); // 522726