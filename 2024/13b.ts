import { chunk } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const nums = chunk(File.numberTable("13.in"), 4);

type Inputs = {
  X: number;
  Y: number;
  Ax: number;
  Ay: number;
  Bx: number;
  By: number;
};

const calcb = ({ X, Y, Ax, Ay, Bx, By }: Inputs) => (Ax * Y - Ay * X) / (Ax * By - Ay * Bx);
const calca = (b: number, { X, Ax, Bx }: Inputs) => (X - Bx * b) / Ax;

let res = 0;
for (const [[Ax, Ay], [Bx, By], [X, Y]] of nums) {
  const inputs = { X: 10000000000000+X, Y: 10000000000000+Y, Ax, Ay, Bx, By };
  const b = calcb(inputs);
  const a = calca(b, inputs);
  if (Number.isInteger(a) && Number.isInteger(b)) {
    res += a * 3 + b;
  }
}

console.log({ res }); // 82510994362072
