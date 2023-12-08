import { fileAsLines } from "./lib/file.ts";
import { regexScan } from "./lib/string.ts";

const lines = fileAsLines('8.in').map(line => line);
const dirs = lines.shift()?.split('') as string[];
lines.shift();

const inputs = Object.fromEntries(lines.map(regexScan(/\w\w\w/g)).map(([a, b, c]) => [a, [b, c]]) );

let pos = 'AAA';
let di = 0;

while (pos !== 'ZZZ') {
    const dir = dirs[di++ % dirs.length] === 'L' ? 0 : 1;
    pos = inputs[pos][dir] as string;
}

console.log({
    di
});
