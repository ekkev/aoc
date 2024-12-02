import { betweenIncluding } from "./lib/math.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const nums = File.numberTable(`2.in`);
const isSafe = (list: number[]) => {
  const isIncreasing = list[1] > list[0];

  return list.map((
    v,
    i,
  ) => (i === 0 || isIncreasing === v > list[i - 1] &&
      betweenIncluding(Math.abs(v - list[i - 1]), 1, 3))
  ).count(false) === 0;
};

const isSafeIfRemoved = (list: number[]) => {
  for (let index = 0; index < list.length; index++) {
    const sublist = list.toSpliced(index, 1);
    if (isSafe(sublist)) {
      return true;
    }
  }
};

const res = nums.map(isSafeIfRemoved).count(true);

console.log({ res }); // 674
