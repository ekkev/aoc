import { File, globalProtos } from "./lib/index.ts";
import { M, matrixFirstPosOf, matrixFromString, matrixGet, xydistance, xyequal, xymove } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";
globalProtos();

const kpnum = matrixFromString('789\n456\n123\nX0A');
const kpdir = matrixFromString(`X^A\n<v>`);

const maxDepth = 25;

const pairCostAtMaxDepth = new Map<string, number>();
const findMinCostAtMaxDepth = (matrix: M<string>, start: string, end: string, depth = 0): number => {
    if (start === end) return 1;

    const key = [start, end, depth].join();
    const startPos = matrixFirstPosOf(matrix, start);
    const endPos = matrixFirstPosOf(matrix, end);

    if (depth === maxDepth) return 1 + xydistance(startPos, endPos);
    if (pairCostAtMaxDepth.has(key)) return pairCostAtMaxDepth.get(key)!;

    const it = findPathsFlexi({
        startNodes: [{ pos: startPos, moves: '' }],
        endCondition: ({pos}) => xyequal(pos, endPos),
        nextMovesFn: ({pos, moves}) => ['v','<','>','^'].map(dir => ({
            pos: xymove(pos, dir),
            moves: moves + dir,
        })),
        cacheKeyFn: ({moves}) => moves,
        isValidMoveFn: ({pos}) => 'X' !== (matrixGet(matrix, pos) ?? 'X'),
        costFn: ({moves, pos}, cost) => cost
            + findMinCostAtMaxDepth(kpdir, moves.at(-2) ?? 'A', moves.at(-1)!, depth + 1)
            + (xyequal(pos, endPos) ? findMinCostAtMaxDepth(kpdir, moves.at(-1)!, 'A', depth + 1) : 0),
    });

    return pairCostAtMaxDepth.set(key, it.next().value.finalCost).get(key)!;
}

const res = File.lines("21.in").map(numpattern =>
    [...numpattern]
        .map((to, i, arr) => findMinCostAtMaxDepth(kpnum, i ? arr[i-1] : 'A', to))
        .sum() * parseInt(numpattern)
).sum();

console.log({ res }); // 223285811665866