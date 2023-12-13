import { protosArray } from "./lib/array.ts";
import { fileAsString } from "./lib/file.ts";
import { matrixFromString, rotateMatrix } from "./lib/matrix.ts";
protosArray();

const lines = fileAsString('13.in').split(/\n\n/).map(matrixFromString);

const calc = (l: string[][]) => {
    for (let i = 1; i < l.length; i++) {
        const len = Math.min(i, l.length - i);
        const a = l.slice(i-len, i).reverse().flat();
        const b = l.slice(i, i+len).flat();

        const diffs = a.filter((v,z) => v !== b[z]).length;

        if (diffs === 1)
            return i;
    }
    return 0;
}

const ans = lines.map(l => 100 * calc(l) + calc(rotateMatrix(l))).sum();
console.log({ans})
// 39359