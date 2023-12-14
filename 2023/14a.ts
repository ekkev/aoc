import { matrixFindVerticalPatterns, matrixFromFile } from "./lib/matrix.ts";
import { protosString } from "./lib/string.ts";
protosString();

const matrix = matrixFromFile('14.in');
const height = matrix.length;

let result = 0;
const matches = matrixFindVerticalPatterns(matrix, { regex: /[O.]+/g });

for (const [[_, start], str] of matches) {
    const n = str.count('O');
    const first = height - start;
    const last = first - n + 1;
    result += n * (last + first) / 2;
}

console.log({result})
// 113456