import { fileAsLines } from "./lib/file.ts";
import { ints } from "./lib/string.ts";

const lines = fileAsLines('5.in');
const seeds = ints(lines.shift()!);
// [dest start, source start, lenght]
const maps: Record<string, [number, number, number][]> = {}

let key = '';
for (const line of lines) {
    const m = line.match(/^(.*) map:/);
    if (m) {
        key = m[1]!
        maps[key] = [];
    } else if (line !== '') {
        maps[key].push(ints(line) as [number, number, number]);
    }
}

const state = [...seeds]
for (const [_key, map] of Object.entries(maps)) {
    for (const [i, cur] of state.entries()) {
        for (const [dst, src, len] of map) {
            if (cur >= src && cur < src+len) {
                if (state[i] !== cur) {
                    throw new Error(`dupe ${cur} vs ${state[i]}`)
                }
                state[i] = cur-src + dst;
            }
        }
        // None match, keep value
    }
}

console.log({ min: Math.min(...state)}) // 403695602
