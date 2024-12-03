import { File, globalProtos } from "./lib/index.ts";
import { ints } from "./lib/string.ts";
globalProtos();

const text = File.lines(`3.in`).join("");
const res = [...text.matchAll(/mul\((\d{1,3},\d{1,3})\)/g)].map((m) =>
  ints(m[1]).product()
).sum();

console.log({ res }); // 188741603
