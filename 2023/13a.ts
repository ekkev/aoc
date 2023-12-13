import { protosArray } from "./lib/array.ts";
import { fileAsString } from "./lib/file.ts";
import { matrixFromString, rotateMatrix } from "./lib/matrix.ts";
protosArray();

const lines = fileAsString('13.in').split(/\n\n/).map(matrixFromString);

const calc = (l: string[][]) => {
    for (let i = 1; i < l.length; i++) {
        const len = Math.min(i, l.length - i);
        const a = l.slice(i-len, i).reverse();
        const b = l.slice(i, i+len);

        if (a.join() === b.join())
            return i;
    }
    return 0;
}

const ans = lines.map(l => 100 * calc(l) + calc(rotateMatrix(l))).sum();
console.log({ans});
// 31265. Had a bug where i excluded last line in comparisons initially (i < l.length-1).. premature false optimisation