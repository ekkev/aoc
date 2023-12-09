import { fileAsLines } from "./lib/file.ts";
import { ints } from "./lib/string.ts";
import { sum } from "./lib/array.ts";

const lines = fileAsLines('9.in').map(line => ints(line));

let result = 0;
for (const line of lines) {
    let cur = line;
    const last = [];
    while (!cur.every(v => v === 0)) {
        const next = [];
        for (let i = 0; i < cur.length-1; i++) {
            next.push(cur[i+1] - cur[i]);
        }
        last.push(next.at(-1))
        cur = next;
    }

    result += sum(last) + line.at(-1)!
}

console.log({ result });
// 2038472161
