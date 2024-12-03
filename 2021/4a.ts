import { sum } from "../2024/lib/array.ts";
import { File } from "../2024/lib/file.ts";
import { ints, regexScan } from "../2024/lib/string.ts";

const cards = File.lines('4.in')
                    .map(line => line.split(':')[1].split('|').map(ints))

const winCounts = cards.map(([wins, mine]) => mine.filter(v => wins.includes(v)).length);
const points = winCounts.filter(v => v > 0).map(v => 2**(v-1));

console.log({ result: sum(points) }) // 21959



