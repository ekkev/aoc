import { File, globalProtos } from "./lib/index.ts";
import { sortCompareNumericAsc } from "./lib/array.ts";
globalProtos();

const [left, right] = File.numberTable(`1.in`).tableColumns().map((col) =>
  col.sort(sortCompareNumericAsc)
);

const res = left.map((v, i) => Math.abs(v - right[i])).sum();

console.log({ res }); // 2756096
