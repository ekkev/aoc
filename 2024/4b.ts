import { File, globalProtos } from "./lib/index.ts";
import { matrixFindElements, matrixGet, xyadd } from "./lib/matrix.ts";
globalProtos();

const matrix = File.charMatrix("4.in");

const res = matrixFindElements(matrix, { value: "A" }).map(([pos]) => {
  return [
        matrixGet(matrix, xyadd(pos, [-1, -1])),
        matrixGet(matrix, xyadd(pos, [1, 1])),
      ].toSorted().join("") === "MS" &&
    [
        matrixGet(matrix, xyadd(pos, [1, -1])),
        matrixGet(matrix, xyadd(pos, [-1, 1])),
      ].toSorted().join("") === "MS";
}).count(true);

console.log({ res });
