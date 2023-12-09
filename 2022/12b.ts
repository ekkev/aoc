import { lineByLine } from './file.ts'
import { XY, xykey } from './lib/matrix.ts';
import { findPathsFlexi } from './lib/path.ts';

// How many positions does the tail of the rope visit at least once?
async function solve () {
    const rows: number[][] = [];

    let [Sx, Sy, Ex, Ey] = [NaN, NaN, NaN, NaN]; // ...batman
    const charCodeOffset = 'a'.charCodeAt(0);

    for await (const line of await lineByLine('12.in')) {
        rows.push(line.split('').map(v => v.charCodeAt(0) - charCodeOffset));
        if (line.indexOf('S') > -1) {
            Sx = line.indexOf('S');
            Sy = rows.length - 1;
            rows[Sy][Sx] = 'a'.charCodeAt(0) - charCodeOffset; // = 1
        }
        if (line.indexOf('E') > -1) {
            Ex = line.indexOf('E');
            Ey = rows.length - 1;
            rows[Ey][Ex] = 'z'.charCodeAt(0) - charCodeOffset;
        }
    }

    const get = ([x, y]: XY) => rows[y][x];
    const allMoves = (x: number, y: number): XY[] => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
    const isWithinBounds = ([x, y]: XY): boolean => !(x < 0 || y < 0 || x >= rows[0].length || y >= rows.length);

    const itFinder = findPathsFlexi({
        startNodes: [[Ex, Ey]],
        //  (el.y === Sy && el.x === Sx) { // 12a
        endCondition: (pos: XY) => get(pos) === 'a'.charCodeAt(0) - charCodeOffset, // 12b
        nextMovesFn: ([x, y]) => allMoves(x, y).filter(isWithinBounds),
        isValidMoveFn: (to: XY, from: XY) => get(from) - get(to) <= 1,
        cacheKeyFn: xykey,
    });

    return itFinder.next().value.finalCost;
}

solve().then(console.log) // 430