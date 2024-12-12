import { File, globalProtos } from "./lib/index.ts";
import { matrixClone, matrixFindElements, matrixGet, matrixSet, xydirections } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";
globalProtos();

const matrix = File.charMatrix("12.in");

const VISITED = "."
const visitedMatrix = matrixClone(matrix);

const res = matrixFindElements(matrix, {predicate: () => true}).map(([pos, val]) => {
    if (matrixGet(visitedMatrix, pos) === VISITED) return 0;
    matrixSet(visitedMatrix, pos, VISITED);

    let area = 1, edges = 0;
    const itFinder = findPathsFlexi({
        startNodes: [pos],
        nextMovesFn: (from) => {
            const [go, nogo] = xydirections(from).split(to => matrixGet(matrix, to) === val);
            edges += nogo.length;
            
            const targets = go.filter(to => matrixSet(visitedMatrix, to, VISITED) !== VISITED)
            area += targets.length;
            return targets;
        }
    });
    [...itFinder];
    return area * edges;
}).sum();

console.log({ res }); // 1370100


