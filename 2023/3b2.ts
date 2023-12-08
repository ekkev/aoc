import { sum } from "./lib/array.ts";
import { matrixFindElements, matrixFindHorizontalPatterns, matrixFromFile } from "./lib/matrix.ts";
import { tupleGroupByKey, tupleValues } from "./lib/tuple.ts";

const matrix = matrixFromFile('3.in');
const allNumbers = matrixFindHorizontalPatterns(matrix, {
    regex: /\d+/
});

const gearToNumberTuples = allNumbers
            .map(([[x, y], num]) => 
                matrixFindElements(matrix, {
                    predicate: v => v === '*',
                    map: _ => num,
                    bbox: [[x-1, y-1], [x + num.length, y+1]],
                }))
            .flat();

const res = sum(tupleValues(tupleGroupByKey(gearToNumberTuples))
                    .filter((v) => v.length === 2)
                    .map((v) => Number(v[0]) * Number(v[1])));

console.log({res}); // 81721933