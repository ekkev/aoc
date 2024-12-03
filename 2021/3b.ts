import { File } from "../2024/lib/file.ts";
import { arrayMode, countElementsInGroups, protosArray } from "../2024/lib/array.ts";
import { protosString } from "../2024/lib/string.ts";
protosArray(); protosString();

const FILE = `3.in`;
const lines = File.lines(FILE);
const cols = File.columns(FILE);
const mode = cols.map(v => arrayMode(v)).flat();

const modeOfPos = (list: string[], pos: number) => {
    const freq = countElementsInGroups(list.map(str => str[pos]));
    return freq['0'] === freq['1'] ? undefined : freq['0'] > freq['1'] ? '0' : '1';
}

let foroxy = [...lines];
let forco2 = [...lines];
let pos = 0;
while (foroxy.length > 1 && pos < lines[0].length) {
    console.log('POS', pos);
    const mode = modeOfPos(foroxy, pos) ?? '1';
    foroxy = foroxy.filter(str => str[pos] === mode);
    pos++;
}

pos = 0;
while (forco2.length > 1 && pos < lines[0].length) {
    console.log('POS', pos);
    const mode = modeOfPos(forco2, pos) ?? '1';
    forco2 = forco2.filter(str => str[pos] !== mode);
    pos++;
}

// const a = parseInt(mode.join(''), 2);
// const b = parseInt(mode.map(v => v == 1 ? 0 : 1).join(''), 2);
// // const fields = rotateMatrix(lines);
let res = 0;

console.log({ foroxy, forco2, r: parseInt(foroxy[0], 2) * parseInt(forco2[0], 2) });

