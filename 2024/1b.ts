import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const [left, right] = File.numberTable(`1.in`).tableColumns();

const res = left.map((v) => v * right.count(v)).sum();

console.log({ res }); // 23117829
