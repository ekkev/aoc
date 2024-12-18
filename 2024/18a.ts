import { chunk } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
import { XY, matrixCreate, matrixGet, matrixSetter, xydirections, xykey } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";
globalProtos();

const matrix = matrixCreate(71, 71);
const nums = [...chunk(File.numberList("18.in"), 2)].slice(0, 1024) as XY[];
nums.forEach(matrixSetter(matrix, '#'));

const res = findPathsFlexi({
    startNodes: [[0,0] as XY],
    endCondition: ([x, y]) => x===70 && y===70,
    nextMovesFn: (pos) => xydirections(pos),
    isValidMoveFn: (to) => matrixGet(matrix, to) === '.',
    cacheKeyFn: (pos) => xykey(pos),
}).next().value.finalCost;

console.log({ res }); // 344