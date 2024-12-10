import { File, globalProtos } from "./lib/index.ts";
import { matrixFindElements, matrixGet, xydirections } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";
globalProtos();

const matrix = File.numberMatrix("10.in");
const startNodes = matrixFindElements(matrix, { value: 0 }).map(([p, value]) => ({ p, value, start: p }));

const itFinder = findPathsFlexi({
  startNodes,
  endCondition: ({ value }) => 9 === value,
  nextMovesFn: ({ p, value, start }) =>
    xydirections(p)
    .filter((t) => matrixGet(matrix, t) === 1 + value)
    .map((p) => ({ p, value: 1 + value, start })),
});

const res = [...itFinder].length;
console.log({ res }); // 1344