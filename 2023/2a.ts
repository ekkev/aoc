import { readAllLines } from "./lib/file.ts";

const lines = readAllLines('2.in');
const have = {
    red: 12,
    green: 13,
    blue: 14
}

let result = 0;
for (const [idx, line] of lines.entries()) {
    const colors = line.split(':')[1].split(/[,;]/)
        .map(v => v.trim().split(' '))
        .map(([num, col]) => [Number(num), col]) as [number, keyof typeof have][];

    const possible = colors.every(([v,k]) => have[k] >= v);
    console.log(colors, possible)
    if (possible) {
        result += idx+1;
    }
}

console.log(result); // 2771