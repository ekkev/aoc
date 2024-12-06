import { File, globalProtos } from "./lib/index.ts";
import { DirStr, inMatrix, matrixFindElements, matrixGet, matrixSet, xydirturn, xymove } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";

globalProtos();

const matrix = File.charMatrix('6.in');

let dir: DirStr = 'u';
const start = matrixFindElements(matrix, { value: '^'})[0][0];

const itFinder = findPathsFlexi({
    startNodes: [start],
    endCondition: (p) => !inMatrix(matrix, xymove(p, dir)),
    nextMovesFn: (p) => {
        while ('#' === matrixGet(matrix, xymove(p, dir))) {
            dir = xydirturn(dir, 'r');
        }
        return [xymove(p, dir)];
    },
    beforeMoveFn: (p) => matrixSet(matrix, p, 'X')
});

[...itFinder];

const res = matrixFindElements(matrix, { value: 'X'}).length

console.log({ res }); // 5199


