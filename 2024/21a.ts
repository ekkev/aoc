import { File, globalProtos } from "./lib/index.ts";
import { M, matrixFirstPosOf, matrixFromString, matrixGet, xyequal, xymove } from "./lib/matrix.ts";
import { findPathsFlexi } from "./lib/path.ts";
globalProtos();

const kpnum = matrixFromString('789\n456\n123\nX0A');
const kpdir = matrixFromString(`X^A\n<v>`);

const maxDepth = 2;
const mdMovesCache = new Map<string, string>(); 

const findShortestPathAtMaxDepth = (matrix: M<string>, start: string, end: string, depth = 0): string => {
    if (start === end) return 'A';

    const key = [start, end, depth].join();
    if (mdMovesCache.has(key)) return mdMovesCache.get(key)!;

    const endPos = matrixFirstPosOf(matrix, end);
    const it = findPathsFlexi({
        startNodes: [{ pos: matrixFirstPosOf(matrix, start), moves: '', mdMoves: ''  }],
        endCondition: ({pos}) => xyequal(pos, endPos),
        nextMovesFn: ({pos, moves, mdMoves}) => ['v','<','>','^'].map(dir => {
            const next = {
                pos: xymove(pos, dir),
                moves: moves + dir,
                mdMoves
            };

            next.mdMoves += (depth === maxDepth) ? dir : findShortestPathAtMaxDepth(kpdir, moves.at(-1) ?? 'A', dir, depth + 1);
            if (xyequal(next.pos, endPos))
                next.mdMoves += (depth === maxDepth) ? 'A' : findShortestPathAtMaxDepth(kpdir, dir, 'A', depth + 1)

            return next;
        }),
        cacheKeyFn: ({moves}) => moves,
        isValidMoveFn: ({pos}) => 'X' !== (matrixGet(matrix, pos) ?? 'X'),
        costFn: ({mdMoves}) => mdMoves.length,
    });

    return mdMovesCache.set(key, it.next().value.finalElement.mdMoves).get(key)!;
}

const res = File.lines("21.in").map(numpattern =>
    [...numpattern]
        .map((to, i, arr) => findShortestPathAtMaxDepth(kpnum, i ? arr[i-1] : 'A', to).length)
        .sum() * parseInt(numpattern)
).sum();

console.log({ res }); // 179444