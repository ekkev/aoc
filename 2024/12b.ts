import { File, globalProtos } from "./lib/index.ts";
import { X, XY, matrixClone, matrixFindElements, matrixGet, matrixSet, xyadd, xydirections, xymulN } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";
globalProtos();

const matrix = File.charMatrix("12.in");

const VISITED = "."
const visitedMatrix = matrixClone(matrix);

const res = matrixFindElements(matrix, {predicate: () => true}).map(([pos, val]) => {
    if (matrixGet(visitedMatrix, pos) === VISITED) return 0;
    matrixSet(visitedMatrix, pos, VISITED);

    let area = 1;
    const edgemap: Record<string, [XY, XY]> = {};
    const itFinder = findPathsFlexi({
        startNodes: [pos],
        nextMovesFn: (from) => {
            const [go, nogo] = xydirections(from).split(to => matrixGet(matrix, to) === val);
            nogo.forEach(to => edgemap[[from,to].join()] = [from, to]);

            const targets = go.filter(to => matrixSet(visitedMatrix, to, VISITED) !== VISITED)
            area += targets.length;

            return targets;
        }
    });
    [...itFinder];

    let straights = 0;
    const edgeKeys = Object.keys(edgemap);
    for (const key of edgeKeys) {
        if (!edgemap[key]) continue;
        straights++;

        const [from, to] = edgemap[key];
        delete edgemap[key];

        const diff: XY = from[X] === to[X] ? [1, 0] : [0, 1];
        let n = 1;
        while (edgemap[[xyadd(from, xymulN(diff, n)), xyadd(to, xymulN(diff, n))].join()]) {
            delete edgemap[[xyadd(from, xymulN(diff, n)), xyadd(to, xymulN(diff, n))].join()];
            n++;
        }

        n = -1;
        while (edgemap[[xyadd(from, xymulN(diff, n)), xyadd(to, xymulN(diff, n))].join()]) {
            delete edgemap[[xyadd(from, xymulN(diff, n)), xyadd(to, xymulN(diff, n))].join()];
            n--;
        }
    }
    return area * straights;
}).sum();


console.log({ res }); // 818286