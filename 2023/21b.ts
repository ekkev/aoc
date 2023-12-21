import { XY, matrixSet, matrixFromFile, matrixGet, matrixFindElements, xydirections, xykey } from "./lib/matrix.ts";
import { ints } from "./lib/string.ts";

const matrix = matrixFromFile('21.in')
const start = matrixFindElements(matrix, { predicate: v => v==='S'})[0][0] as XY;
console.log({start})
matrixSet(matrix, start, '.')

const len = matrix.length;

let delta = 0;
const stepcounters = [];

let q = [start] as XY[];
let i;
for (i = 1; i <= 6*len; i++) {
    const nq: Record<string, true> = {};
    for (const pos of q) {
        xydirections(pos)
            .filter(([x, y]) => '.' === matrixGet(matrix, [(len*100 + x)%len, (100*len + y)%len]))
            .map(p => nq[xykey(p)]=true);
    }

    stepcounters[i] = Object.keys(nq).length;

    // Cycle finder - observed stable growth in diffs of len-size
    if (i > len * 3) {
        const prev = stepcounters[i-len];
        const prevdiff = stepcounters[i-len] - stepcounters[i-len*2];
        const prevdelta = prevdiff - (stepcounters[i-len*2]-stepcounters[i-len*3])

        delta = stepcounters[i] - prev-prevdiff;

        console.log({i, delta, prev, prevdiff})
        if (delta === prevdelta) {
            console.log('equal');
            break;
        }
    }

    q = Object.keys(nq).map(ints) as XY[];
}

const target = 26501365;
const minN = i - len*2;

// Where full loop starts that ends cleanly at target
let togo = len * Math.floor((target-minN)/len);
const loopstart = target - togo;

let sum = stepcounters[loopstart];
let diff = stepcounters[loopstart+len] - sum;

console.log({togo, loopstart, sum, diff, delta,  minN, len});

while (togo > 0) {
    togo -= len;
    sum += diff;
    diff += delta;
}

console.log(sum);
// 620348631910321