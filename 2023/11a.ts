import { matrixFindElements, matrixFindHorizontalPatterns, matrixFindVerticalPatterns, matrixFromFile } from "./lib/matrix.ts";
import { tupleObj } from "./lib/tuple.ts";

const matrix = matrixFromFile('11.in');
matrixFindHorizontalPatterns(matrix, { regex: /^\.*$/g})
    .reverse()
    .map(([[_x, y], row]) => matrix.splice(y, 0, [...row]));

const emptyCols = matrixFindVerticalPatterns(matrix, { regex: /^\.*$/g}).map(([[x]]) => x);
for (const x of emptyCols.toReversed()) {
    for (const row of matrix) {
        row.splice(x, 0, '.');
    }
}

const galaxies = tupleObj(matrixFindElements(matrix, { predicate: v => v === '#' })
                                        .map(([pos], i) => [i, pos]));

let ans = 0;
for (let i = 0 ; i < Object.keys(galaxies).length; i++) {
    const [xa, ya] = galaxies[i];
    for (let j = i+1; j < Object.keys(galaxies).length; j++) {
        const [xb, yb] = galaxies[j];
        ans += Math.abs(xa-xb) + Math.abs(ya-yb);
    }
}

console.log(ans)
// Not 10174534 -- was a bug in adding in empty rows
// 10154062