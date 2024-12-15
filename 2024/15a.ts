import { File, globalProtos } from "./lib/index.ts";
import { matrixFindElements, matrixFromString, matrixGet, matrixSet, xyadd, xymove, xymulN } from "./lib/matrix.ts";
globalProtos();

const [BOX, WALL, ROBOT, EMPTY] = 'O#@.';
const [map, instsRaw] = File.string("15.in").split(/\n\n/);
const matrix = matrixFromString(map);

let pos = matrixFindElements(matrix, { value: ROBOT }).at(0)![0];
matrixSet(matrix, pos, EMPTY);

instsRaw.replaceAll(`\n`, '').split('').forEach(dir => {
    const nextPos = xymove(pos, dir);
    const block = matrixGet(matrix, nextPos);
    if (block === WALL) return;
    if (block === EMPTY) return pos = nextPos;

    
    const stepMove = xymove([0,0], dir);
    for (let offset = 0;; offset++) {
        const checkPos = xyadd(nextPos, xymulN(stepMove, offset));
        switch (matrixGet(matrix, checkPos)) {
            case WALL: return;
            case BOX: continue;
            case EMPTY:
                matrixSet(matrix, nextPos, matrixSet(matrix, checkPos, BOX));
                return pos = nextPos;
        }
    }
})

const res = matrixFindElements(matrix, {value: 'O'}).map(([[x, y]]) => 100*y+x).sum()
console.log({ res }); // 1451928