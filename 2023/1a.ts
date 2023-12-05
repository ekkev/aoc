import { readAllLines } from "./lib/file.ts";

const lines = readAllLines('1.in');
const res = lines.reduce((sum, line) => sum + 
    Number(
        line.split('').filter(v => !isNaN(Number(v)))[0]
      + line.split('').filter(v => !isNaN(Number(v))).reverse()[0])
, 0);
console.log(res);
// 54697