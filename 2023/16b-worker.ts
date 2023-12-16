import { DirStr, M, XY, inMatrix, matrixFromFile, matrixGet, xydirturn, xymove } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";

console.log('worker start');
const matrix = matrixFromFile('16.in');


const nextdirs = (chr: string, dir: DirStr): DirStr[] => {
    if (chr === `\\` && 'lr'.includes(dir)) return [xydirturn(dir, 'r')];
    if (chr === `\\` && 'ud'.includes(dir)) return [xydirturn(dir, 'l')];

    if (chr === `/` && 'lr'.includes(dir)) return [xydirturn(dir, 'l')];
    if (chr === `/` && 'du'.includes(dir)) return [xydirturn(dir, 'r')];

    if (chr === `|` && 'rl'.includes(dir)) return ['u', 'd'];
    if (chr === `-` && 'ud'.includes(dir)) return ['l', 'r'];

    return [dir];
}

const findfrom = (matrix: M, start: XY, startdir: DirStr): number => {
    const seen = new Set<string>();

    const itFinder = findPathsFlexi({
        startNodes: [[start, startdir] as [XY, DirStr]],
        // Turn and move a step, potentially splitting paths
        nextMovesFn: ([pos, dir]) => 
            nextdirs(matrixGet(matrix, pos)!, dir)
                .map(d2 => [xymove(pos, d2), d2] as [XY, DirStr]),
        beforeMoveFn: ([pos]) => seen.add(pos.join()), // Keep track of visited-once positions
        cacheKeyFn: el => el.join(), // Avoid infinite loops
        isValidMoveFn: ([pos]) => inMatrix(matrix, pos), // Stay in bounds, or stop
    });

    [...itFinder]; // Run generator to end - until all paths out of bounds
    return seen.size;
}

self.onmessage = (e) => {
    const { x, y, startdir } = e.data;
    const res = findfrom(matrix, [Number(x), Number(y)], startdir);
    self.postMessage(res);
}