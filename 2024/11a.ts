import { rangeExclusive } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

let nums = File.numberList("11.in");

const ROUNDS = 25;

const step = (n: number) => {
  const nstr = n.toString();
  return n === 0 ? 1 : nstr.length % 2 ? n * 2024 : [
    parseInt(nstr.substring(0, nstr.length / 2), 10),
    parseInt(nstr.substring(nstr.length / 2), 10),
  ];
};

rangeExclusive(0, ROUNDS).forEach(() => nums = nums.map(step).flat());

const res = nums.length;
console.log({ res }); // 212655
