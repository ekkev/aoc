import { fileAsLines } from "./lib/file.ts";
import { ints } from "./lib/string.ts";

const lines = fileAsLines('9.in').map(line => ints(line));

let result = 0;
for (const line of lines) {
    let cur = line;
    const first = [];

    while (!cur.every(v => v === 0)) {
        const next = [];
        for (let i = 0; i < cur.length-1; i++) {
            next.push(cur[i+1] - cur[i]);
        }
        first.unshift(next[0])
        cur = next;
    }

    result += line[0] - first.reduce((s,v) => v-s, 0)
}


console.log({result})
// 1091