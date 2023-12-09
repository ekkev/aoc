import { readFileSync } from "node:fs";
import { findPathsFlexi } from "./lib/path.ts";

type XYZ = [number, number, number];

async function solve() {
    const xyzKey = (pos: XYZ) => pos.join(':');

    const pixels = readFileSync('18.in', 'utf-8').split(/\n/).map(row => row.split(',').map(s => parseInt(s))) as XYZ[];
    const pixelSet = new Set(pixels.map(xyzKey));
    const isValidMoveFn = (move: XYZ) => move.every(dim => dim >= -1 && dim <= 22); // contained bbox

    const nextMovesFn = (pos: XYZ) => [
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1],
    ].map(move => [pos[0] + move[0], pos[1] + move[1], pos[2] + move[2]] as XYZ);
    const endCondition = (pos: XYZ) => pixelSet.has(xyzKey(pos));

    let surfacearea = 0;
    const startNodes: XYZ[] = [[-1, -1, -1]];


    // Traverse space around pixels - min-max in each 3 dimensions
    // As a bfs path finding, if direction from pixel is blocked, count as exterior surface, else add to queue to observe next
    const itFinder = findPathsFlexi({
        startNodes,
        endCondition,
        nextMovesFn,
        // Unusually, want end condition to be reached from every possible direction = not caching steps to it
        cacheKeyFn: (pos: XYZ) => endCondition(pos) ? undefined : xyzKey(pos),
        isValidMoveFn,
    });
    
    // Surface area grows each time we reach an existing pixel (endCondition)
    for (const v of itFinder) {
        surfacearea++;
        console.log(v)
    }

    return { surfacearea };
}


solve().then(console.log)
 // 2582, 2052
