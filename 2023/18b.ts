import { protosArray } from "./lib/array.ts";
import { fileAsTuples } from "./lib/file.ts";
import { XY, xyadd } from "./lib/matrix.ts";
protosArray();

const input = fileAsTuples('18.in');
const dirmap: XY[] = [[1,0], [0, 1], [-1, 0], [0, -1]];

let pos: XY = [0, 0];
let walls = 0;
const corners = [pos] as XY[]

for (const [_dir, _cnt, col] of input) {
    const dir = dirmap[Number(col.at(-2))];
    const cnt = parseInt(col.substring(2, 7), 16);

    walls += cnt;
    pos = xyadd(pos, [dir[0] * cnt, dir[1] * cnt]);
    corners.push(pos);
}

// Bit of shoelace from the other day
const area = corners.map(([x1, y1], i) => {
    const [x2, y2] = corners[(i+1) % corners.length];
    return x1 * y2 - x2 * y1;
}).sum();

console.log({area: 1 + walls/2 + Math.abs(area)/2})
//45757884535661