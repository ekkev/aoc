import { fileAsLines } from "./lib/file.ts";
import { ints } from "./lib/string.ts";

const lines = fileAsLines('6.in');

const times = ints(lines.shift()!);
const dists = ints(lines.shift()!);

console.log({times, dists});

const results = times.map(() => 0);

for (const race of times.keys()) {
    const target = dists[race];
    const time = times[race];

    for (let speed = 1; speed < time; speed++) {
        const rem = time - speed;
        if (rem * speed > target)
            results[race]++;
    }
}

console.log({results, res: results.reduce((p, v)=>p*v, 1)})