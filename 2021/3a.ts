import { File } from "../2024/lib/file.ts";
import { arrayMode, protosArray } from "../2024/lib/array.ts";
import { protosString } from "../2024/lib/string.ts";
protosArray(); protosString();

const FILE = `3.in`;
const lines = File.columns(FILE).map(arrayMode).flat();
const a = parseInt(lines.join(''), 2);
const b = parseInt(lines.map(v => v == '1' ? '0' : '1').join(''), 2);
// const fields = rotateMatrix(lines);
let res = 0;

console.log({ res:a*b });

