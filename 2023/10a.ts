import { matrixDown, matrixFindElements, matrixFromFile, matrixGet, matrixLeft, matrixPrint, matrixRight, matrixUp, xyadd } from "./lib/matrix.ts";

const matrix = matrixFromFile('10.in');
matrixPrint(matrix)

const dirs = {
    r: matrixRight(),
    l: matrixLeft(),
    u: matrixUp(),
    d: matrixDown(),
};

type Sigil = 'J' | '7' | 'L' | 'F' | '-' | '|';
let pos = matrixFindElements(matrix, { predicate: (v) => v==='S'})[0][0];

// Find starting direction, the hard way
const l = matrixGet<Sigil>(matrix, matrixLeft(pos));
const r = matrixGet<Sigil>(matrix, matrixRight(pos));
const u = matrixGet<Sigil>(matrix, matrixUp(pos));
const d = matrixGet<Sigil>(matrix, matrixDown(pos));

let dir: keyof typeof dirs = 'u';
if (r && 'J7-'.includes(r)) {
    dir = 'r';
} else if (l && 'FL-'.includes(l)) {
    dir = 'l';
} else if (u && 'JL|'.includes(u)) {
    dir = 'u';
} else if (d && '7F|'.includes(d)) {
    dir = 'd';
}

let steps = 0;
while (steps++ < 100000) {
    pos = xyadd(pos, dirs[dir]);
    const next = matrixGet<Sigil | 'S'>(matrix, pos);
    if (next === 'S') {
        break;
    }

    if (next === '|' || next === '-') {
        continue;
    }

    if (next === 'L') {
        dir = dir === 'd' ? 'r' : 'u';
    }
    if (next === 'J') {
        dir = dir === 'd' ? 'l' : 'u';
    }
    if (next === '7') {
        dir = dir === 'u' ? 'l' : 'd';
    }
    if (next === 'F') {
        dir = dir === 'u' ? 'r' : 'd';
    }
}

console.log({steps, ans: steps/2});
// 6773
