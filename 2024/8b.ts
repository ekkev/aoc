import { File, globalProtos } from "./lib/index.ts";
import {
  matrixFindElements,
  matrixSetIfInside,
  xyadd,
  xyequal,
  xymulN,
  xysub,
} from "./lib/matrix.ts";
globalProtos();

const matrix = File.charMatrix("8.in");
const groups = matrixFindElements(matrix, { predicate: (el) => el !== "." }).tupleGroupByValue();

groups.tupleValues().forEach((ants) =>
  ants.forEach((pos1) =>
    ants.forEach((pos2) => 
      xyequal(pos1, pos2) ||
      ((i = 0) => {
        while (matrixSetIfInside(matrix, xyadd(pos1, xymulN(xysub(pos1, pos2), i++)), "#"));
      })())
  )
);

const res = matrixFindElements(matrix, { value: "#" }).length;
console.log({ res }); // 962
