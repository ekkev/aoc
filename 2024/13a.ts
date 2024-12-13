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
  const inputs = { X, Y, Ax, Ay, Bx, By };
  const b = calcb(inputs);
  const a = calca(b, inputs);
  if (a <= 100 && b <= 100 && Number.isInteger(a) && Number.isInteger(b)) {
    res += a * 3 + b;
  }
}

console.log({ res }); // 35997

/**
 *

X = Ax * a + Bx * b
Y = Ay * a + By * b

a = (X - Bx * b)/Ax
a = X/Ax - (Bx/Ax)*(b/Ax)

b = (Y - Ay * a)/By

b = (Y - Ay * a)/By
b = Y/By - (Ay/By) * (a/By)

b = (Y - Ay * (X - Bx * b)/Ax)/By
b = Y/By - Ay*X/(Ax*By) + Ay*Bx*b/(Ax*By)
b - Ay*Bx*b/(Ax*By) =  Y/By - Ay*X/(Ax*By)
b * (1 -  Ay*Bx/(Ax*By) = Y/By - Ay*X/(Ax*By)

B = (Y/By - Ay*X/(Ax*By)) / (1 -  Ay*Bx/(Ax*By))

B = (Y/By - Ay*X/(Ax*By)) / ((Ax*By -  Ay*Bx)/(Ax*By))

B = (1/By)*(Y - Ay*X/Ax)  * By * Ax / (Ax*By -  Ay*Bx)

B = (Y - Ay*X/Ax) * Ax / (Ax*By -  Ay*Bx)
B = (Ax*Y - Ay*X) / (Ax*By -  Ay*Bx)
 */
