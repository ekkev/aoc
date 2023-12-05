import { chunk } from "./lib/array.ts";
import { fileAsLines } from "./lib/file.ts";
import { ints } from "./lib/string.ts";
import { Tuple, tupleKeys } from "./lib/tuple.ts";

const lines = fileAsLines('5.in');
const seeds = ints(lines.shift()!);
// [dest start, source start, len]
const maps: Record<string, [number, number, number][]> = { }


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

let state: [number, number][] = [...chunk(seeds,2)].map(([start, len]) => [start, start+len]); /// end is excluded from range
for (const [key, map] of Object.entries(maps)) {
    console.log(key, state.length)
    const nextState: typeof state = [];

    for (const stateRange of state) {
        let stateRanges = [stateRange];
        for (const [dststart, srcstart, len] of map) {
            const shift = dststart - srcstart;
            const nextStateRanges: typeof stateRanges = [];

            // Find all overlaps for each state, add to next
            for (const [curstart, curend] of stateRanges) {
                const histart = Math.max(curstart, srcstart);
                const loend = Math.min(curend, srcstart + len);

                if (histart < loend) {
                    // Overlap - split into 3, one to carry to state for next map (already shifted), two to keep considering in this map
                    nextStateRanges.push([curstart, histart]);
                    nextState.push([histart + shift, loend + shift ]);
                    nextStateRanges.push([loend, curend]);
                } else {
                    nextStateRanges.push([curstart, curend]);
                }
            }
            stateRanges = nextStateRanges.filter(([s, e]) => s!==e); // take non-empty ranges to next map entry
        }
        nextState.push(...stateRanges);
    }
    state = nextState;
}

console.log({ min: Math.min(...tupleKeys(state))}) // 219529182
