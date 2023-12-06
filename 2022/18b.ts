import { readFileSync } from "fs";

type XYZ = [number, number, number];

async function solve() {
    const pixels = readFileSync('18.in', 'utf-8').split(/\n/).map(row => row.split(',').map(s => parseInt(s))) as XYZ[];
    const pixelSet = new Set(pixels.map(v => v.join(':')));
    const isValidMove = (move: XYZ) => move.every(dim => dim >= -1 && dim <= 22); // contained bbox

    // Traverse space around pixels - min-max in each 3 dimensions
    // As a bfs path finding, if direction from pixel is blocked, count as exterior surface, else add to queue to observe next

    let surfacearea = 0;
    let q: XYZ[] = [[-1, -1, -1]];
    let visited: Set<string> = new Set([-1, -1, -1].join(':'));

    for (const pos of q) {
        [
            [1, 0, 0],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
            [0, 0, 1],
            [0, 0, -1],
        ].map(move => [pos[0] + move[0], pos[1] + move[1], pos[2] + move[2]] as XYZ)
             .filter(isValidMove)
             .forEach(move => {
                    if (pixelSet.has(move.join(':'))) {
                        surfacearea++;
                    } else if (!visited.has(move.join(':'))) {
                        visited.add(move.join(':'));
                        q.push(move);   
                    }
                });
    }
    return surfacearea;
}


solve().then(console.log)
 // 2582
