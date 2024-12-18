import { chunk } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
import { XY, matrixCreate, matrixGet, matrixSet, matrixSetter, xydirections, xykey } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";
globalProtos();

const matrix = matrixCreate(71, 71);
const stack = [...chunk(File.numberList("18.in"), 2)].slice(1024) as XY[];
const nums = [...chunk(File.numberList("18.in"), 2)].slice(0, 1024) as XY[];
nums.forEach(matrixSetter(matrix,'#'));

const firstMatch = () =>
    findPathsFlexi({
        startNodes: [{pos: [0,0] as XY, path: ['0,0']}],
        endCondition: ({pos: [x, y]}) => x === 70 && y === 70,
        nextMovesFn: ({pos, path}) => xydirections(pos).map(to => ({ pos: to, path: path.concat(xykey(to)) })),
        isValidMoveFn: (to) => matrixGet(matrix, to.pos) === '.',
        cacheKeyFn: ({pos}) => xykey(pos),
    }).next().value;

let path = firstMatch();
stack.forEach(pos => {
    matrixSet(matrix, pos, '#');

    if (path.finalElement.path.includes(xykey(pos))) {
        path = firstMatch();
        if (!path.finalElement) {
            console.log({ res: pos.join() }); // 46,18
            throw 'done';
        }
    }
});