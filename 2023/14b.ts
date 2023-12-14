import { protosArray } from "./lib/array.ts";
import { XY, matrixClone, matrixFindElements, matrixFromFile, matrixGet, matrixSet, matrixToString } from "./lib/matrix.ts";
protosArray();

const matrix = matrixFromFile('14.in');

const dirs = 'nwse'.split('');
let di = 0;
let ci = 0;
let repstart = -1;
const max = 1000000000;
const seen = new Map<string, number>();
const cache = [];

const shift = (empties: XY[], pos: XY) => {
    const cur  = matrixGet(matrix, pos);
    if (cur === '.') {
        empties.push(pos);

    } else if (cur === 'O' && empties.length) {
        const newpos = empties.shift()!
        matrixSet(matrix, pos, '.');
        matrixSet(matrix, newpos, 'O');
        empties.push(pos);

    } else if (cur === '#') {
        empties.length = 0;
    }
};

while (ci < max) {

    if (0 === di % dirs.length) {
        const key = matrixToString(matrix);
        if (seen.has(key)) {
            repstart = seen.get(key)!;
            if ((max - repstart) % (ci - repstart) === 0) {
               break;
            }
        }
    
        seen.set(key, ci);
        cache.push(matrixClone(matrix));
        ci++;
    }


    const dir = dirs[di++ % dirs.length];

    if ('ns'.includes(dir)) {
        if (dir === 's') matrix.reverse();

        for (let x = 0; x < matrix[0].length; x++) {

            const empties: [number, number][] = [];
            for (let y = 0; y < matrix.length; y++) {
                shift(empties, [x, y]);
            }
        }

        if (dir === 's') matrix.reverse();

    } else { // e-w
        for (let y = 0; y < matrix.length; y++) {
            if (dir === 'e') matrix[y].reverse();

            const empties: [number, number][] = [];
            for (let x = 0; x < matrix[y].length; x++) {
                shift(empties, [x, y])
            }

            if (dir === 'e') matrix[y].reverse();
        }
    }
}

console.log({repstart})

const m = cache[repstart];
const matches = matrixFindElements(m, { predicate: v => v === 'O'})
                    .map(([[_x, y]]) => m.length - y)
console.log({result: matches.sum()})

// 118747
// 2 false answers due to buggy cycle detection..