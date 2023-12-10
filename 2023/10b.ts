import { XY, matrixClone, matrixDown, matrixFindElements, matrixFromFile, matrixGet, matrixLeft, matrixPrint, matrixRight, matrixSet, matrixUp, xyadd, xydirections } from "./lib/matrix.ts";

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

const matrixWithPathAsX = [...matrix.map(line => [...line])];

const startdir = dir;
const start = pos;

let steps = 0;
while (steps++ < 100000) {
    pos = xyadd(pos, dirs[dir]);
    const next = matrixGet<Sigil | 'S'>(matrix, pos);

    matrixSet(matrixWithPathAsX, pos, 'X');
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

const enddir = dir;

console.log({steps, ans: steps/2, startdir, enddir})

// Create a clone with everything expect the found path replaced with a '.'
// Found path stays as-is
const onlydots = matrixClone(matrix);
matrixFindElements(matrixWithPathAsX, { predicate: v => v !== 'X'}).map(([p]) => 
    matrixSet(onlydots, p, '.'));

// Replace start position marker ('S') for closed loop in next step
let startchr = '-';
const pair = [startdir, enddir].join('');
if (['du', 'ud'].includes(pair)) startchr = '|';
if (['ru', 'dl'].includes(pair)) startchr = 'F';
if (['lu', 'dr'].includes(pair)) startchr = '7';
if (['rd', 'ul'].includes(pair)) startchr = 'L';
if (['ld', 'ur'].includes(pair)) startchr = 'J';
matrixSet(onlydots, start, startchr);;

console.log('-------- dots --------')
matrixPrint(onlydots);

pos = start;
dir = startdir;
const outsideHandMarker = 'o';
let prevdir = dir;
// Walk the path marking manually either right or left hand side dots
// No code to detect which side will be inside, just trying both
// Happened to be left in my input
while (1) {
    const cur = matrixGet<Sigil | 'S'>(matrix, pos);
    const curanddir = [cur, prevdir].join('');

    // Right-hand path to marker
    // if (['-r', 'Ld', 'Jr'].includes(curanddir))
    //     matrixGet(onlydots, matrixDown(pos)) === '.'  && matrixSet(onlydots, matrixDown(pos), marker);
    // if (['-l', 'Fl', '7u'].includes(curanddir))
    //     matrixGet(onlydots, matrixUp(pos)) === '.'  && matrixSet(onlydots, matrixUp(pos), marker);
    // if (['|d', 'Ld', 'Fl'].includes(curanddir))
    //     matrixGet(onlydots, matrixLeft(pos)) === '.'  && matrixSet(onlydots, matrixLeft(pos), marker);
    // if (['|u', 'Jr', '7u'].includes(curanddir))
    //     matrixGet(onlydots, matrixRight(pos)) === '.'  && matrixSet(onlydots, matrixRight(pos), marker);

    // Left-hand path to marker
    if (['-l', 'Ll', 'Jd'].includes(curanddir))
        matrixGet(onlydots, matrixDown(pos)) === '.' && matrixSet(onlydots, matrixDown(pos), outsideHandMarker);
    if (['-r', 'Fu', '7r'].includes(curanddir))
        matrixGet(onlydots, matrixUp(pos)) === '.' && matrixSet(onlydots, matrixUp(pos), outsideHandMarker);
    if (['|u', 'Ll', 'Fu'].includes(curanddir))
        matrixGet(onlydots, matrixLeft(pos)) === '.' && matrixSet(onlydots, matrixLeft(pos), outsideHandMarker);
    if (['|d', '7r', 'Jd'].includes(curanddir))
        matrixGet(onlydots, matrixRight(pos)) === '.' && matrixSet(onlydots, matrixRight(pos), outsideHandMarker);

    pos = xyadd(pos, dirs[dir]);

    // Take from original matrix to keep 'S' for end detection
    const next = matrixGet<Sigil | 'S'>(matrix, pos);
    
    if (next === 'S') {
        break;
    }

    if (next === '|' || next === '-') {
        continue;
    }

    prevdir = dir;
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

// From every outside point, mark paths that can be discovered with a 'O'
const markOutside = (pos: XY) => {
    const v = matrixGet(onlydots, pos)

    if (v && [' ', '.', outsideHandMarker].includes(v)) { 
        matrixSet(onlydots, pos, 'O');

        for (const p2 of xydirections(pos)) {
            markOutside(p2)
        }
    }
}

markOutside([0, 0]);
matrixPrint(onlydots)

// Now we have in matrix: original path, some 'O' for outside paths,
// 'o' for not obviously outside, but on the otuside hand of the path,
// and some '.'-s for originally present undiscovered areas.
// Count remaining '.'-s.
const ins = matrixFindElements(onlydots, { predicate: v => v === '.'})
console.log({result: ins.length})
// 493