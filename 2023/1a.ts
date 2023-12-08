import { readAllLines } from "./lib/file.ts";
import { protosArray } from "./lib/array.ts";
protosArray();

const res = readAllLines('1.in')
              .map(line => line.split('').filter(v => !isNaN(Number(v))))
              .map(nums => Number(nums[0] + nums[nums.length-1]))
              .sum();

console.log(res);
// 54697