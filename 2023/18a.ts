import { fileAsTuples } from "./lib/file.ts";
import { XY, matrixSet, matrixGet, xyadd, xydirections, xykey, matrixFindElements, matrixCreate } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";

const input = fileAsTuples('18.in');
const matrix = matrixCreate(1000, 1000);

const dirmap: Record<string, XY> = {
    'R': [1,0],
    'L': [-1, 0],
    'U': [0, -1],
    'D': [0, 1],
}

let pos: XY = [500,500]; // Annoyance: dealing with negative indexes
matrixSet(matrix, pos, '#');

for (const [dir, cnt] of input) {
    for (let i = 0; i < Number(cnt); i++) {
        pos = xyadd(pos, dirmap[dir])
        matrixSet(matrix, pos, '#');
    }
}

const y = matrix.findIndex(row => /^\.+#\.+#\.+$/.test(row.join('')));

const itFinder = findPathsFlexi({
    startNodes: [[matrix[y].indexOf('#')+1, y]],
    nextMovesFn: xydirections,
    cacheKeyFn: xykey,
    beforeMoveFn: pos => matrixSet(matrix, pos, '#'),
    isValidMoveFn: pos => matrixGet(matrix, pos) === '.',
});

itFinder.next(); // run to end as no endcondition given, will never yield

console.log({r: matrixFindElements(matrix, { value: '#' }).length});
// 48652