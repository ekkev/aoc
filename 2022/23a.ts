import { readFileSync } from "node:fs";
import { range } from "./lib/array.ts";

// x, y
type Pos = [number, number];
type Posstr = string;
type Dir = 'N' | 'S' | 'W' | 'E';

const map: string[][] = readFileSync('23.in', 'ascii').split(/\n/).map(row => row.split(''));

const poskey = ([x, y]: Pos): Posstr => `${x},${y}`;
const unposkey = (key: Posstr) => key.split(',').map(Number) as unknown as Pos;
const allmoves = ([x, y]: Pos): Pos[] => [[x+1, y], [x-1, y], [x+1, y+1], [x-1, y+1], [x+1, y-1], [x-1, y-1], [x, y+1], [x, y-1]];
const dirs: Record<Dir, { targets: (pos: Pos) => Pos[], move: (pos: Pos) => Pos }> = {
    N: {
        targets: ([x, y]) => [[x, y-1], [x-1, y-1], [x+1, y-1]],
        move: ([x, y]) => [x, y-1],
    },
    S: {
        targets: ([x, y]) => [[x, y+1], [x-1, y+1], [x+1, y+1]],
        move: ([x, y]) => [x, y+1],
    },
    W: {
        targets: ([x, y]) => [[x-1, y], [x-1, y+1], [x-1, y-1]],
        move: ([x, y]) => [x-1, y],
    },
    E: {
        targets: ([x, y]) => [[x+1, y], [x+1, y+1], [x+1, y-1]],
        move: ([x, y]) => [x+1, y],
    },
}

let positions: Record<Posstr, Pos> = {};
map.forEach((row, y) => row.forEach((v, x) => {
    if (v === '#') positions[poskey([x, y])] = [x, y];
}));

const sequence = Object.keys(dirs) as Dir[];
for (let round = 1; round <= 10; round++) {
    console.log({round, sequence})
    const proposals: Record<Posstr, Posstr[]> = {}; // to => [from, from]

    for (const [key, pos] of Object.entries(positions)) {
        if (allmoves(pos).every((p: Pos) => !(poskey(p) in positions))) {
            proposals[key] = [...proposals[key] ?? [], key];
            continue;
        }

        let matched = false;
        for (const dir of sequence) {
            const targets = dirs[dir].targets(pos);
            if (!targets.some((p: Pos) => poskey(p) in positions)) {
                proposals[poskey(dirs[dir].move(pos))] = [...proposals[poskey(dirs[dir].move(pos))] ?? [], key as Posstr];
                matched = true;
                break;
            }
        }
        if (!matched)
            proposals[key] = [...proposals[key] ?? [], key];
    }

    Object.entries(proposals)
        .filter(([k, v]) => v.length > 1)
        .forEach(([k, v]) => {
            delete proposals[k];
            v.forEach(posstr => {
                proposals[posstr] = [posstr];
            })
        });

    if (Object.keys(proposals).length !== Object.keys(positions).length) {
        throw new Error(`Length mismatch`)
    }

    positions = Object.fromEntries(Object.keys(proposals).map((v) => [v, unposkey(v)]));

    // let i = 0, j = 0;
    // console.log(range(0,12).map(y => 
    // range(0,12).map(x => 
    //     oldpositions[poskey([x, y])] ? (i++).toString(36)[0]  : '.'
    // ).join('')
    //     + '     ' +
    // range(0,12).map(x => 
    //     positions[poskey([x, y])] ? (j++).toString(36)[0]  : '.'
    // ).join('') ).join('\n'));

    // Finally, at the end of the round, the first direction the Elves considered is moved to the end of the list of directions
    sequence.push(sequence.shift()!!);
}


let minx = Infinity,
    maxx = -Infinity,
    miny = Infinity,
    maxy = -Infinity;
Object.values(positions).forEach(([x, y]) => {
    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
});

console.log({minx, maxx, miny, maxy, area: (1+maxx-minx)*(1+maxy-miny), empties: (1+maxx-minx)*(1+maxy-miny) - Object.keys(positions).length})
// { minx: -4, maxx: 74, miny: -4, maxy: 75, area: 6320, empties: 3874 }