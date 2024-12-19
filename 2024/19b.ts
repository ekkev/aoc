import { rangeExclusive } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const lines = File.lines("19.in");
const towels = lines.at(0)!.split(', ');

const ways = new Map([['', 1]]);
const res = lines.slice(2).map(pattern =>
    rangeExclusive(0, pattern.length).reverse().map(p =>
        ways.set(pattern.slice(p),
            towels.filter(t => t === pattern.substr(p, t.length))
                  .map(t => ways.get(pattern.slice(p + t.length)))
                  .sum()))
    && ways.get(pattern)
).sum();

console.log({res}); // 601201576113503