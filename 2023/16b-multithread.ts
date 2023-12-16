import { rangeExclusive } from "./lib/array.ts";
import { matrixFromFile, matrixMaxX, matrixMaxY } from "./lib/matrix.ts";
import { pooledMap } from "https://deno.land/std@0.209.0/async/pool.ts";

const matrix = matrixFromFile('16.in');

const threads = Math.max(1, navigator.hardwareConcurrency - 2);
console.log({ threads });

const workers = Array.from(
    { length: threads }, 
    () => new Worker(new URL("./16b-worker.ts", import.meta.url).href, { type: "module" })
);

const sendReceive = <T>(w: Worker, msg: unknown): Promise<T> => {
    return new Promise<T>(res => {
        w.onmessage = (m) => res(m.data);
        w.postMessage(msg);
    });
}

const [maxX, maxY] = [matrixMaxX(matrix), matrixMaxY(matrix)];
let max = -Infinity;

for await (const vals of pooledMap(
    threads,
    rangeExclusive(0, maxY),
    async y => {
        const w = workers.pop()!;
        const m1 = await sendReceive<number>(w, { x: 0, y, startdir: 'r' });
        const m2 = await sendReceive<number>(w, { x: maxX, y, startdir: 'l' });
        workers.push(w);
        return [m1, m2];
    }
)){
    max = Math.max(max, ...vals);
}

for await (const vals of pooledMap(
    threads,
    rangeExclusive(0, maxX),
    async x => {
        const w = workers.pop()!;
        const m1 = await sendReceive<number>(w, { x, y: 0, startdir: 'd' });
        const m2 = await sendReceive<number>(w, { x, y: maxY, startdir: 'u' });
        workers.push(w);
        return [m1, m2];
    }
)){
    max = Math.max(max, ...vals);
}

console.log({max}) // 8244
workers.forEach(w => w.terminate());