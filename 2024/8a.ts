import { File, globalProtos } from "./lib/index.ts";
import {
  matrixFindElements,
  matrixSetIfInside,
  xyadd,
  xyequal,
  xysub
} from "./lib/matrix.ts";
globalProtos();

const matrix = File.charMatrix("8.in");
const groups = matrixFindElements(matrix, { predicate: (el) => el !== "." }).tupleGroupByValue();

// Mark position same distance in opposite direction for each pair end
groups.tupleValues().forEach((ants) =>
  ants.forEach((pos1) =>
    ants.forEach((pos2) =>
      xyequal(pos1, pos2) ||
      matrixSetIfInside(matrix, xyadd(pos1, xysub(pos1, pos2)), "#")
    )
  )
);

const res = matrixFindElements(matrix, { value: "#" }).length;
console.log({ res }); // 265
