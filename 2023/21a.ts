import { XY, matrixSet, matrixFromFile, matrixGet, matrixFindElements, xydirections } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";

const matrix = matrixFromFile('21.in');

const start = matrixFindElements(matrix, { predicate: v => v==='S'})[0][0] as XY;
console.log({start});
matrixSet(matrix, start, '.');

const itFinder = findPathsFlexi({
    startNodes: [start],
    endCondition: (_, steps) => steps===64,
    nextMovesFn: pos => xydirections(pos),
    cacheKeyFn: (pos: XY, cost) => [pos, cost].join(),
    isValidMoveFn: (pos) => matrixGet(matrix, pos) === '.',
});
    
const res = new Set();
for (const v of itFinder) {
    res.add(v.finalElement.join());
}

console.log(res.size);
//3724