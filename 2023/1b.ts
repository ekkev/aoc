import { readAllLines } from "./lib/file.ts";

const lines = readAllLines('1.in');
let res = 0;

const map: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six:  6,
    seven: 7,
    eight: 8,
    nine: 9,
}

Object.values(map).forEach(v => map[v.toString()]= v);

for (const line of lines) {
    let pos1  = Infinity;
    let one = -1;
    for (const [num, val] of Object.entries(map)) {
        const pos = line.indexOf(num);
        if (pos !== -1 && pos < pos1) {
            pos1 = pos;
            one = val;
        }
    }

    let pos2  = -Infinity;
    let two = -1;
    for (const [num, val] of Object.entries(map)) {
        const pos = line.lastIndexOf(num);
        if (pos > pos2) {
            pos2 = pos;
            two = val;
        }
    }
    res += Number([one === -1 ? '' : one, two === -1 ? '' : two].join(''));
}

console.log(res);
// 54885