import { fileAsLines } from "./lib/file.ts";
import { matrixSet, matrixGet, matrixFindElements, M, XYZ } from "./lib/matrix.ts";
import { ints } from "./lib/string.ts";
import { chunk, rangeInclusive } from "./lib/array.ts";

const input = fileAsLines('22.in').map(ints).map(v => [...chunk(v,3)]) as [XYZ, XYZ][];

const [X, Y, Z] = [0, 1, 2];

// Sort by Z descending
const sorted = input.map(brick => brick.toSorted((a, b) => a[0]-b[0])).toSorted((a, b) => b[1][Z] - a[1][Z]);

const maxX = Math.max(...sorted.map(([a, b]) => Math.max(a[X], b[X])));
const maxY = Math.max(...sorted.map(([a, b]) => Math.max(a[Y], b[Y])));
const maxZ = Math.max(...sorted.map(([a, b]) => Math.max(a[Z], b[Z])));

const EMPTY = -1;
const xyplanes = Array.from({ length: maxZ+1 }, 
                    () => Array.from({ length: maxY+1 }, 
                        () => Array.from({ length: maxX+1 }, () => EMPTY)));

// Fill a xy matrix for each Z
for (const [i, [start, end]] of sorted.entries()) {
    for (const z of rangeInclusive(start[Z], end[Z])) {
        for (const x of rangeInclusive(start[X], end[X])) {
            for (const y of rangeInclusive(start[Y], end[Y])) {
                matrixSet(xyplanes[z], [x,y], i);
            }
        }
    }
}

// Drop bricks
for (const [negz, matrix] of xyplanes.entries()) {
    const idsinplane = new Set(matrix.flat().filter(v=> v !== EMPTY))
    for (const id of [...idsinplane]) {
        let droptarget = negz;
        const positions = matrixFindElements(matrix, { value: id });

        let z = negz;
        while (z-->0) {
            const vacant = positions.every(([[x, y]]) => xyplanes[z][y][x] === EMPTY)
            if (!vacant) break;
            droptarget = z;
        }

        if (droptarget !== negz) {
            positions.forEach(([[x, y]]) => {
                xyplanes[negz][y][x] = EMPTY;
                xyplanes[droptarget][y][x] = id;
            });
        }
    }
}

// Mark which brick is held by which bricks
const holders = sorted.map(_ => new Set<number>());
for (let z = xyplanes.length-1; z > 0; z--) {
    const matrix = xyplanes[z];
    const idsinplane = new Set(matrix.flat())
    idsinplane.delete(EMPTY)

    for (const id of [...idsinplane]) {
        
        const positions = matrixFindElements(matrix, { value: id });
        for (const [pos] of positions) {
            const v = matrixGet(xyplanes[z-1], pos)!;
            if (v !== EMPTY && v !== id) {
                holders[id].add(v);
            }
        }
    }
}
// Count bricks that are the only ones holding any other brick
const causesfalls = new Set(Object.values(holders).filter(s => s.size === 1).map(s => [...s]).flat())

console.log({res: sorted.length - causesfalls.size})

// Part 2:
let res = 0;
for (const id of causesfalls) {
    res += fallsIfRemove(id, xyplanes.map(xy => xy.map(line=>[...line])));
}

function fallsIfRemove(remove: number, planes: M<number>[]) { 
    // Remove a brick
    planes.forEach(matrix => matrixFindElements(matrix, { value: remove }).map(([pos]) => matrixSet(matrix, pos, EMPTY)) );
    
    // Drop others
    const dropped = new Set<number>();
    for (const [negz, matrix] of planes.entries()) {
        const idsinplane = new Set(matrix.flat());
        idsinplane.delete(EMPTY);

        for (const id of [...idsinplane]) {
            let droptarget = negz;
            const positions = matrixFindElements(matrix, { value: id });
    
            let z = negz;
            while (z-->0) {
                const vacant = positions.every(([[x, y]]) => planes[z][y][x] === EMPTY)
                if (!vacant) break;
                droptarget = z;
            }

            if (droptarget !== negz) {
                dropped.add(id);
                positions.forEach(([[x, y]]) => {
                    planes[negz][y][x] = EMPTY;
                    planes[droptarget][y][x] = id;
                });
            }
        }
    }
    return dropped.size;
}

console.log({res})
// 61555