import { matrixFindElements, matrixFindHorizontalPatterns, matrixFindVerticalPatterns, matrixFromFile } from "./lib/matrix.ts";
import { betweenExcluding } from "./lib/math.ts";
import { tupleObj } from "./lib/tuple.ts";

const matrix = matrixFromFile('11.in');
const emptyRows = matrixFindHorizontalPatterns(matrix, { regex: /^\.*$/g }).map(([[_x, y]]) => y);
const emptyCols = matrixFindVerticalPatterns(matrix, { regex: /^\.*$/g }).map(([[x]]) => x);
const galaxies = tupleObj(matrixFindElements(matrix, { predicate: v => v === '#' })
                                        .map(([pos], i) => [i, pos]));

const MULTIPLIER = 1000000;
let ans = 0;
for (let i = 0 ; i < Object.keys(galaxies).length; i++) {
    const [xa, ya] = galaxies[i];
    for (let j = i+1; j < Object.keys(galaxies).length; j++) {
        const [xb, yb] = galaxies[j];
        ans += Math.abs(xa-xb) + Math.abs(ya-yb);
        ans += (MULTIPLIER-1) * emptyRows.filter(y => betweenExcluding(y, ya, yb)).length;
        ans += (MULTIPLIER-1) * emptyCols.filter(x => betweenExcluding(x, xa, xb)).length;
    }
}

console.log(ans)
// 553083047914