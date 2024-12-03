import { betweenIncl } from "./lib/math.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const isSafe = (list: number[]) =>
  list.slice(1).every((v, i) => (list[1] > list[0] === v > list[i] &&
    betweenIncl(Math.abs(v - list[i]), 1, 3))
  );

const res = File.numberTable(`2.in`).count(isSafe);

console.log({ res }); // 639
