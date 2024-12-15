import { File, globalProtos } from "./lib/index.ts";
import { XY, matrixCreate, matrixFindElements, matrixFromString, matrixGet, matrixLeft, matrixWidth, matrixHeight, matrixRight, matrixSet, xyadd, xymove, xymulN } from "./lib/matrix.ts";
globalProtos();

const [BOXL, BOXR, BOX, WALL, ROBOT, EMPTY] = '[]O#@.';

const [map, moves] = File.string("15.in").split(/\n\n/);
const originalMatrix = matrixFromString(map);
const matrix = matrixCreate(matrixWidth(originalMatrix) * 2, matrixHeight(originalMatrix));

const remapBlock = { [WALL]: [WALL, WALL], [ROBOT]: [ROBOT, EMPTY], [BOX]: [BOXL, BOXR] };

matrixFindElements(originalMatrix, { predicate: (v) => Object.hasOwn(remapBlock, v) })
    .map(([[x, y], v]) => [[x * 2, y], remapBlock[v]] as [XY, string[]])
    .forEach(([pos, [l, r]]) => {
        matrixSet(matrix, pos, l);
        matrixSet(matrix, matrixRight(pos), r);
    });

let pos = matrixFindElements(matrix, { value: ROBOT })[0][0];
matrixSet(matrix, pos, EMPTY);

moves.replaceAll(`\n`, '').split('').forEach(dir => {
    const nextPos = xymove(pos, dir);
    const block = matrixGet(matrix, nextPos);
    const stepMove = xymove([0,0], dir);

    if (block === WALL) return;
    if (block === EMPTY) return pos = nextPos;

    if ('<>'.includes(dir)) {
        for (let xoffset = 1;; xoffset++) {
            const testPos = xyadd(nextPos, xymulN(stepMove, xoffset));
            switch (matrixGet(matrix, testPos)) {
                case WALL: return;
                case BOXL: case BOXR: continue;
                case EMPTY:
                    for (;xoffset >= 0; xoffset--) {
                        matrixSet(matrix, 
                            xyadd(nextPos, xymulN(stepMove, xoffset)),
                            matrixGet(matrix, xyadd(nextPos, xymulN(stepMove, xoffset-1)))
                        );
                    }
                    return pos = nextPos;
            }
        }
    }

    // Up/down
    const pendingMoves = [[nextPos]];

    block === BOXR
        ? pendingMoves[0].unshift(matrixLeft(nextPos))
        : pendingMoves[0].push(matrixRight(nextPos));

    while (true) {
        let nextRowPositions = pendingMoves.at(-1)!.map((p) => xyadd(p, stepMove));

        // Cannot move
        if (nextRowPositions.some((p) => WALL == matrixGet(matrix, p))) return;

        // Move to the row
        if (nextRowPositions.every((p) => EMPTY === matrixGet(matrix, p))) {
            pendingMoves.toReversed().forEach((rowMoves) =>
                rowMoves.forEach((p) => matrixSet(matrix, xyadd(p, stepMove), matrixSet(matrix, p, EMPTY)) )
            );
            return pos = nextPos;
        }

        // Some boxes in the next row - add row to pending moves & repeat
        nextRowPositions = nextRowPositions.filter(p => [BOXL, BOXR].includes(matrixGet(matrix, p)!));

        if (BOXR === matrixGet(matrix, nextRowPositions.at(0)!))
            nextRowPositions.unshift(matrixLeft(nextRowPositions.at(0)!));
        if (BOXL === matrixGet(matrix, nextRowPositions.at(-1)!))
            nextRowPositions.push(matrixRight(nextRowPositions.at(-1)!));

        pendingMoves.push(nextRowPositions);
    }

});

const res = matrixFindElements(matrix, { value: BOXL }).map(([[x, y]]) => 100*y+x).sum()

console.log({ res }); // 1462788