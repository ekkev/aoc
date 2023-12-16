import { DirStr, XY, inMatrix, matrixForEachCol, matrixForEachRow, matrixFromFile, matrixGet, matrixMaxX, matrixMaxY, xydirturn, xymove } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";

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

const findfrom = (start: XY, startdir: DirStr): number => {
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

let max = -Infinity;
matrixForEachRow(matrix, y => {
    max = Math.max(findfrom([0, y], 'r'), max);
    max = Math.max(findfrom([matrixMaxX(matrix), y], 'l'), max);
});

matrixForEachCol(matrix, x => {
    max = Math.max(findfrom([x, 0], 'd'), max);
    max = Math.max(findfrom([x, matrixMaxY(matrix)], 'u'), max);
});

console.log(max); // 8244