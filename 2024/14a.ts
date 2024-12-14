import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const robs = File.numberTable("14.in");
const W = 101, H = 103, C = 100;
const midW = Math.floor(W / 2), midH = Math.floor(H / 2);

const ends = robs.map(([x, y, vx, vy]) => [((x + vx * C) % W + W) % W, ((y + vy * C) % H + H) % H]);

const res = ends
    .filter(([x, y]) => x !== midW && y !== midH)
    .split(([x]) => x > midW).map(list => list.split(([_, y]) => y > midH)).flat()
    .map(list => list.length).product();

console.log({ res }); // 226179492
