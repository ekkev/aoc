import { fileAsLines } from "./lib/file.ts";
import { regexScan } from "./lib/string.ts";
import { lcm } from "./lib/math.ts";

const lines = fileAsLines('8.in').map(line => line);
const dirs = lines.shift()?.split('') as string[];
lines.shift();

const inputs = Object.fromEntries(lines.map(regexScan(/\w\w\w/g)).map(([a, b, c]) => [a, [b, c]]) );

const starts = Object.keys(inputs).filter(s => s.endsWith('A'));
const answers = starts.map(pos => {
    let di = 0;
    while (!pos.endsWith('Z')) {
        const dir = dirs[di++ % dirs.length] === 'L' ? 0 : 1;
        pos = inputs[pos][dir] as string;
    }
    return di;
});

console.log({answers})
console.log(answers.reduce((p, v) => lcm(p,v), 1))
//21083806112641
