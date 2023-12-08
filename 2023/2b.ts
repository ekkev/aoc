import { readAllLines } from "./lib/file.ts";
import { tupleGroupByKey } from "./lib/tuple.ts";


const lines = readAllLines('2.in');

let result = 0;
for (const line of lines) {
    const cols = line.split(':')[1].split(/[,;]/)
        .map(v => v.trim().split(' '))
        .map(([num, col]) => [col, Number(num)]) as [string, number][];
    result += tupleGroupByKey(cols).reduce((prev, [_, v]) => prev * Math.max(...v), 1);
}

console.log(result); //70924