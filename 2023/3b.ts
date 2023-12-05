import { readAllLines } from "./lib/file.ts";

const lines = readAllLines('3.in');


const isNumber = (v: string|undefined) => {
    return !isNaN(Number(v));
}

const startNumber = (str: string) => {
    const m = str.match(/^(\d+)/);
    if (m)
        return m[0];
}

const endNumber = (str: string) => {
    const m = str.match(/(\d+)$/);
    if (m)
        return m[0];
}

const numbersAt = (str: string, index: number) => {
    const left = endNumber(str.substring(0, index));
    const right = startNumber(str.substring(index+1));
    if (isNumber(str[index])) {
        return [[left, str[index], right].filter(v => v !== undefined).join('')];
    } else {
        return [left, right].filter(v => v !== undefined);
    }
}

let result = 0;
const gearPos = lines.map((line, idx) => [...line.matchAll(/(\*)/g)].map(({ index }) => [idx, index] as [number, number])).flat();
for (const [y, index] of gearPos) {
    const left = isNumber(lines[y][index! - 1]) ? endNumber(lines[y].substring(0, index!)) : undefined;
    const right = isNumber(lines[y][index! + 1]) ? startNumber(lines[y].substring(index! + 1)) : undefined;
    const up = lines[y-1] ? numbersAt(lines[y-1], index!) : [];
    const down = lines[y+1] ? numbersAt(lines[y+1], index!) : [];
    const nums = [...up, ...down, left, right].filter(v => v !== undefined);

    if (nums.length == 2) {
        result += Number(nums[0]) * Number(nums[1]);
    }
}
// 81721933
console.log({result})