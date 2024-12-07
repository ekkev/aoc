import { arrayOfValue } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const rows = File.numberTable("7.in");

type Ops = ("*" | "+" | "|")[];

const calc = (nums: number[], ops: Ops) =>
  nums.reduce((prev, cur, i) => {
    if (i === 0) return cur;
    switch (ops[i - 1]) {
      case "*":
        return prev * cur;
      case "+":
        return prev + cur;
      case "|":
        return parseInt(prev + "" + cur, 10);
    }
  });

const rec = (
  nums: number[],
  ops: Ops,
  sum: number,
  opsi: number,
): boolean =>
  opsi === ops.length
    ? calc(nums, ops) === sum
    : rec(nums, ops, sum, opsi + 1) ||
      rec(nums, ops.toSpliced(opsi, 1, "+"), sum, opsi + 1) ||
      rec(nums, ops.toSpliced(opsi, 1, "|"), sum, opsi + 1);

const res = rows.map(([sum, ...list]) =>
  rec(list, arrayOfValue(list.length - 1, "*"), sum, 0) ? sum : 0
).sum();

console.log({ res }); // 333027885676693
