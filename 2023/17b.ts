import { DirStr, XY, inMatrix, matrixFromFile, matrixGet, matrixMaxX, matrixMaxY, matrixPrint, xydirturn, xymove } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";

const matrix = matrixFromFile('17.in')
const mvalue = matrix.map(line => line.map(v => Number(v)));
matrixPrint(matrix);

const start = [0,0] as XY;
const [Ex, Ey] = [matrixMaxX(matrix), matrixMaxY(matrix)];

const itFinder = findPathsFlexi<[XY, DirStr, number]>({
    startNodes: [[start, 'r', 0], [start, 'd', 0]],
    // beforeMoveFn: ([pos, dir, cnt], cost) => console.log({pos,dir,cnt, cost}),
    endCondition: ([[x,y]]) => x === Ex && y === Ey,
    nextMovesFn: ([pos, dir, cnt]) => {
        const r: [XY, DirStr, number][] = [[xymove(pos, dir), dir, cnt+1]];
        if (cnt >= 3) {
            r.push([xymove(pos, xydirturn(dir, 'r')), xydirturn(dir, 'r'), 0])
            r.push([xymove(pos, xydirturn(dir, 'l')), xydirturn(dir, 'l'), 0])
        }
        return r;
    },
    costFn: ([pos], cost) => cost + matrixGet(mvalue, pos)!,
    cacheKeyFn: ([pos, dir, cnt]) => [pos, dir, cnt].join(),
    isValidMoveFn: ([pos, _dir, cnt]) => inMatrix(matrix, pos) && cnt <= 9,
});
const v = itFinder.next().value;
console.log({v, ans: v.finalCost});
// 918

