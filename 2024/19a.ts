import { File, globalProtos } from "./lib/index.ts";
import { findPathsFlexi } from "./lib/path.ts";
globalProtos();

const lines = File.lines('19.in');
const towels = lines.at(0)!.split(', ');

const res = lines.slice(2)!.map(pattern => 
    findPathsFlexi({
        startNodes: [pattern],
        endCondition: (rem) => !rem,
        nextMovesFn: (rem) => towels.filter(t => rem.startsWith(t)).map(t => rem.slice(t.length)),
        cacheKeyFn: (rem) => rem,
    }).next().done
).count(false);

console.log({ res }); // 226