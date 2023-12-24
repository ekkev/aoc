import { XY, inMatrix, matrixSet, matrixFromFile, matrixGet, matrixMaxX, matrixMaxY, matrixPrint, xydirections, xykey, matrixClone, matrixFindElements, xyequal } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";

const matrix = matrixFromFile('23.in');
const start = [1,0] as XY;
const target = [matrixMaxX(matrix)-1, matrixMaxY(matrix)] as XY;

// Remove arrows from map
matrixFindElements(matrix, {predicate: v => v !== '#' && v !== '.'}).forEach(([pos]) => matrixSet(matrix, pos, '.'));

const crossings = {} as Record<string, {
    pos: XY,
    paths: Record<string, number>,
}>;

// Find all crossroads
const dots = matrixFindElements(matrix, {value:'.'});
for (const [pos] of dots) {
    const neigs = xydirections(pos).map(np => matrixGet(matrix, np)).filter(v => v==='.');
    if (neigs.length > 2)
        crossings[xykey(pos)] = {pos, paths: {}};
}
crossings[xykey(start)] = {pos: start, paths: {}};
crossings[xykey(target)] = {pos: target, paths: {}};

// New map with crossings marked
const m2 = matrixClone(matrix);
Object.values(crossings).forEach(({pos}) => matrixSet(m2, pos, 'X'));

// Find path lengths between crossroads
for (const crossing of Object.values(crossings)) {
    const xpos = crossing.pos;
    const neigs = xydirections(xpos);
    for (const strt of neigs) {
        if (matrixGet(m2, strt) !== '.') continue;

        const itFinder = findPathsFlexi<XY>({
            startNodes: [strt],
            endCondition: pos => matrixGet(m2, pos) === 'X',
            nextMovesFn: xydirections,
            isValidMoveFn: pos => !xyequal(xpos, pos) && inMatrix(m2, pos) && matrixGet(m2, pos) !== '#',
            cacheKeyFn: xykey,
        });
        const r = itFinder.next();
        crossing.paths[xykey(r.value.finalElement)] = r.value.finalCost + 1;
    }
}

matrixPrint(m2);
console.log({crossings});

// Find longest path through crossroads
const itFinder = findPathsFlexi<[string, string[]]>({
    startNodes: [[xykey(start), [xykey(start)]]] ,
    endCondition: ([key]) => key == xykey(target),
    nextMovesFn: ([from, path]) => 
        Object.keys(crossings[from].paths)
            .filter(key => !path.includes(key))
            .map(v => [v, [...path, v]]),
    costFn: ([to], cost, [from]) => cost + crossings[from].paths[to],
    prioritizeHighCost: true,
    // Importantly, no cacheKeyFn passed in
});

let max = 0;
for (const v of itFinder) {
    if (v.finalCost > max)
        console.log(max = v.finalCost)
}
// 6718