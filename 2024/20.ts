import { File, globalProtos } from "./lib/index.ts";
import { XYKey, matrixFindElements, matrixGet, xydirections, xydistance, xyequal, xykey, xyunkey } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";
globalProtos();

const matrix = File.charMatrix("20.in");
const start = matrixFindElements(matrix, { value: 'S' })[0][0];

const distToEnd: Record<XYKey, number> = {};
findPathsFlexi({
    startNodes: [matrixFindElements(matrix, { value: 'E' })[0][0]],
    endCondition: (pos) => xyequal(pos, start),
    nextMovesFn: xydirections,
    isValidMoveFn: (pos) => '#' !== matrixGet(matrix, pos),
    beforeMoveFn: (pos, cost) => distToEnd[xykey(pos)] = cost,
    cacheKeyFn: xykey,
}).next();

const dots = Object.keys(distToEnd).map(xyunkey);
const findCheats = (maxCheatDistance: number) =>
    dots.flatMap(p1 =>
        dots.filter(p2 => xydistance(p1, p2) <= maxCheatDistance 
                    && distToEnd[xykey(p1)]! - distToEnd[xykey(p2)]! - xydistance(p1, p2) >= 100)
    ).length;

console.log({ res1: findCheats(2), res2: findCheats(20) }); // 1378, 975379