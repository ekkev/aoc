import { File, globalProtos } from "./lib/index.ts";
import { DirStr, matrixFindElements, matrixGet, matrixSet, xydirturn, xyequal, xykey, xymove } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";
globalProtos();

const matrix = File.charMatrix("16.in");

const start = matrixFindElements(matrix, {value:'S'})[0][0];
const end = matrixFindElements(matrix, {value:'E'})[0][0];
matrixSet(matrix, end, '.');

const cheapest = new Map<string, number>();
cheapest.set([start, 'r'].join(), 0);

const it = findPathsFlexi({
    startNodes: [{pos: start, dir: 'r' as DirStr, visited: xykey(start)}],
    endCondition: ({pos}) => xyequal(pos, end),
    nextMovesFn: ({pos, dir, visited}) => 
        [dir, xydirturn(dir, 'r'), xydirturn(dir, 'l')]
        .map((nextDir) => ({
            pos: xymove(pos, nextDir),
            dir: nextDir,
            visited: visited + '|' + xykey(xymove(pos, nextDir)),
        })),
    isValidMoveFn: ({pos, dir}, _, cost) => matrixGet(matrix, pos) === '.' && cost < (cheapest.get([pos, dir].join()) ?? Infinity),
    beforeMoveFn: ({pos, dir}, cost) => cheapest.set([pos, dir].join(), cost),
    costFn: (to, cost, from) => cost + (to.dir === from.dir ? 1 : 1001),
});

const paths = [...it];
const min = Math.min(...paths.map(p => p.finalCost))
const res = paths.filter(p => p.finalCost === min).flatMap(p => p.finalElement.visited.split('|')).countDistinct();
console.log({min, res }); // 670