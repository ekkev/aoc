import { File } from "../2024/lib/file.ts";
import { protosArray } from "../2024/lib/array.ts";
import { protosString } from "../2024/lib/string.ts";
protosArray(); protosString();

const FILE = `1.in`;
const nums = File.numbers(FILE)
.map((v, i, a) => i > (a.length - 2) ? NaN : a[i]+a[i+1]+a[i+2])
.map((v, i, a) => i>0 && v > a[i-1]).filter(v=>v).length;


console.log({nums})


