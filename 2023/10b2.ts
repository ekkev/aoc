import { fileAsNumbers, fileAsTuples } from "./lib/file.ts";
import { XY, matrixClone, matrixDown, matrixFindElements, matrixFromFile, matrixGet, matrixLeft, matrixPrint, matrixRight, matrixSet, matrixUp, xyadd, xydirections } from "./lib/matrix.ts";

// ! Run with: node --stack-size=10000 --max_old_space_size=20000000 -r ts-node/register 10b.ts
// Deno call stack limits hit in recursion otherwise

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

matrixPrint(onlydots)

// Interleave gaps (' ') after each column and row, to be able to find path to outside bits stuck inside
const matrixDouble = onlydots.map(line => [[...line], Array.from({ length: line.length }, () => ' ')])
        .flat().map(line => line.map(v => [v, ' ']).flat());

// Fill in pipe path in doubled gaps where possible
matrixFindElements(matrixDouble, { predicate: v => v === ' '}).forEach(([pos]) => {
    const l = matrixGet(matrixDouble, matrixLeft(pos));
    const r = matrixGet(matrixDouble, matrixRight(pos));
    const u = matrixGet(matrixDouble, matrixUp(pos));
    const d = matrixGet(matrixDouble, matrixDown(pos));

    if (l && r && 'FL-'.includes(l) && 'J7-'.includes(r)) {
        matrixSet(matrixDouble, pos, '-');
    }

    if (u && d && '7F|'.includes(u) && 'JL|'.includes(d)) {
        matrixSet(matrixDouble, pos, '|')
    }
});

console.log('-------- double --------')
// matrixPrint(matrixDouble);
        
// From every outside point, mark paths that can be discovered with a 'O'
const markoutside = (pos: XY) => {
    const v = matrixGet(matrixDouble, pos)

    if (v && [' ', '.'].includes(v)) { 
        matrixSet(matrixDouble, pos, 'O');

        for (const p2 of xydirections(pos)) {
            const v2 = matrixGet(matrixDouble, p2);
            if (v2 && [' ', '.'].includes(v2))
                markoutside(p2)
        }
    }
}

// for (let y = 0; y < matrixDouble.length; y++) {
//     markoutside([0, y]);
//     markoutside([matrixDouble[0].length-1, y]);
// }

console.log('-------- end --------')
// matrixPrint(matrixDouble);

matrixPrint(onlydots);
pos = start;
dir = startdir;
const marker = 'o';
const markerL = 'o';
let prevdir = dir;
while (1) {
    const cur = matrixGet<Sigil | 'S'>(matrix, pos);
    console.log({cur, pos, dir})
    const curanddir = [cur, prevdir].join('');

    // // Right-hand path to marker
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
        matrixGet(onlydots, matrixDown(pos)) === '.'  && matrixSet(onlydots, matrixDown(pos), markerL);
    if (['-r', 'Fu', '7r'].includes(curanddir))
        matrixGet(onlydots, matrixUp(pos)) === '.'  && matrixSet(onlydots, matrixUp(pos), markerL);
    if (['|u', 'Ll', 'Fu'].includes(curanddir))
        matrixGet(onlydots, matrixLeft(pos)) === '.'  && matrixSet(onlydots, matrixLeft(pos), markerL);
    if (['|d', '7r', 'Jd'].includes(curanddir))
        matrixGet(onlydots, matrixRight(pos)) === '.'  && matrixSet(onlydots, matrixRight(pos), markerL);


    pos = xyadd(pos, dirs[dir]);
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
const markoutside1 = (pos: XY) => {
    const v = matrixGet(onlydots, pos)

    if (v && [' ', '.', marker].includes(v)) { 
        matrixSet(onlydots, pos, 'O');

        for (const p2 of xydirections(pos)) {
            const v2 = matrixGet(onlydots, p2);
            if (v2 && [' ', '.', marker].includes(v2))
                markoutside1(p2)
        }
    }
}

for (let y = 0; y < onlydots.length; y++) {
    markoutside1([0, y]);
    markoutside1([onlydots[0].length-1, y]);
}
matrixPrint(onlydots)

// Now we have in matrix: original path, some 'O' for outside paths, ' '-s for expanded undiscovered areas
// and some '.'-s for originally present undiscovered areas.
// Count remaining '.'-s.
const ins = matrixFindElements(matrixDouble, { predicate: v => v === '.'})
const inss = matrixFindElements(onlydots, { predicate: v => v === '.'})
console.log({res: ins.length, result: inss.length})
// 493