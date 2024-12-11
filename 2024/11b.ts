import { rangeExclusive } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const nums = File.numberList("11.in");

const step = (n: number) => {
  const nstr = n.toString();
  return n === 0 ? 1 : nstr.length % 2 ? n * 2024 : [
    parseInt(nstr.substring(0, nstr.length / 2), 10),
    parseInt(nstr.substring(nstr.length / 2), 10),
  ];
};

const memo: Record<number, number[]> = {};
const step25 = (n: number) => {
  if (!memo[n]) {
    let nums = [n];
    rangeExclusive(0, 25).forEach(() => nums = nums.map(step).flat());
    memo[n] = nums;
  }
  return memo[n];
};

// Poor man's recursion
const res = nums.map((num) =>
  step25(num).map((after25) =>
    step25(after25).map((after50) => step25(after50).length).sum()
  ).sum()
).sum();

console.log({ res }); // 253582809724830
