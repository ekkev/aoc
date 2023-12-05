import { sum } from "./lib/array.ts";
import { fileAsLines } from "./lib/file.ts";
import { regexScan } from "./lib/string.ts";

const cards = fileAsLines('4.in')
                    .map(line => line.split(':')[1].split('|').map(regexScan(/\d+/g)))

const winCounts = cards.map(([wins, mine]) => mine.filter(v => wins.includes(v)).length);
const points = winCounts.filter(v => v > 0).map(v => 2**(v-1));

console.log({ result: sum(points) }) // 21959



