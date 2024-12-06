import { File, globalProtos } from "./lib/index.ts";
import { xykey } from "./lib/matrix.ts";
import { DirStr, inMatrix, matrixFindElements, matrixGet, matrixSet, xydirturn, xyequal, xymove } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";

globalProtos();

const matrix = File.charMatrix('6.in');

let dir: DirStr = 'u';
const start = matrixFindElements(matrix, { value: '^'})[0][0];

let res = 0;

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

matrixFindElements(matrix, { value: 'X'}).forEach(([obstacle]) => { 
    let dir: DirStr = 'u';
    const visited: Record<string, true> = {};
    const itFinder = findPathsFlexi({
        startNodes: [start],
        endCondition: (p) => { 
            const key = xykey(p)+dir;
            if (visited[key]) {
                res++;
                return true;
            }
            return !inMatrix(matrix, xymove(p, dir));
        },
        nextMovesFn: (p) => {
            const key = xykey(p)+dir;
            visited[key] = true;

            let nextpos = xymove(p, dir);
            while ('#' === matrixGet(matrix, nextpos) || xyequal(obstacle, nextpos)) {
                dir = xydirturn(dir, 'r');
                nextpos = xymove(p, dir);
            }
            return [nextpos];
        },
    });
    [...itFinder];
});

console.log({ res }); // 1915


