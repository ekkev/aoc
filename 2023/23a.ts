import { XY, inMatrix, matrixFromFile, matrixGet, matrixMaxX, matrixMaxY, matrixPrint, xydirections, xykey, matrixRight, matrixLeft, matrixUp, matrixDown, xyequal } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";

const matrix = matrixFromFile('23.in');

matrixPrint(matrix);
const start = [1, 0] as XY;
const target = [matrixMaxX(matrix)-1, (matrixMaxY(matrix))] as XY;

const itFinder = findPathsFlexi<[XY, string[]]>({
    startNodes: [[start, []]],
    endCondition: ([pos]) => xyequal(pos, target),
    nextMovesFn: ([pos, path]) => { 
        path.push(xykey(pos));
        switch (matrixGet(matrix, pos)) {
            case '>': return [[matrixRight(pos), [...path]]];
            case 'v': return [[matrixDown(pos), [...path]]];
            case '<': return [[matrixLeft(pos), [...path]]];
            case '^': return [[matrixUp(pos), [...path]]];
        }
        return xydirections(pos).map(dir => [dir, [...path]]);
    },
    isValidMoveFn: ([[x, y], path]) => inMatrix(matrix, [x, y]) && matrixGet(matrix, [x, y]) !== '#' && !path.includes(xykey([x,y])),
});

let max = 0;
for (const v of itFinder) {
    if (v.finalCost > max)
        console.log(max = v.finalCost)
}
// 2306