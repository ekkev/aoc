import { readFileSync } from "node:fs";

type Dir = 'R' | 'L' | 'U' | 'D';
type Pos = [number, number];
function solve () {
    const [map_, steps_] = readFileSync('22.in', 'ascii').split(/\n\n/);
    const steps = steps_.split(/([LR])/)
    const map = map_.split('\n').map(row => row.split(''));
    const mapget = ([x, y]: Pos) => map[y] ? (map[y][x] === ' ' ? '' : map[y][x]) ?? '' : '';

    // Middle square (from [50,100]) is bottom of cube
    /*
   1     2      3
1       Top   Right
2       Back
3 Left  Bottom
4 Front
    */
    const [BEG_1, BEG_2, BEG_3, BEG_4] = [ 0, 50, 100, 150];
    const [END_1, END_2, END_3, END_4] = [49, 99, 149, 199];
    const moves: Record<Dir, (pos: Pos, next?: Pos) => [Dir, Pos]> = {
        R: ([x, y], next = [x + 1, y]) =>
                mapget(next) ? ['R', next]
                : y <= END_1 ? ['L', [END_2, END_3 - y]]            // right to bottom
                : y <= END_2 ? ['U', [BEG_3 + (y - BEG_2), END_1]]  // back to right side
                : y <= END_3 ? ['L', [END_3, END_1 - (y - BEG_3)]]  // bottom to right side
                             : ['U', [BEG_2 + (y - BEG_4), END_3]]  // front to bottom
        ,
        D: ([x, y], next = [x, y + 1]) =>
                mapget(next) ? ['D', next]
                : x <= END_1 ? ['D', [x + BEG_3, BEG_1]]            // front to right
                : x <= END_2 ? ['L', [END_1, BEG_4 + (x - BEG_2)]]  // bottom to front
                             : ['L', [END_2, BEG_2 + (x - BEG_3)]]  // right to back
        ,
        L: ([x, y], next = [x - 1, y]) =>
                mapget(next) ? ['L', next]
                : y <= END_1 ? ['R', [BEG_1, END_3 - y]]            // wrap top to left
                : y <= END_2 ? ['D', [y - BEG_2, BEG_3]]            // back to left
                : y <= END_3 ? ['R', [BEG_2, END_1 - (y - BEG_3)]]  // left to top
                             : ['D', [BEG_2 + (y - BEG_4), BEG_1]]  // front to top            
        ,
        U: ([x, y], next = [x, y - 1]) => 
                mapget(next) ? ['U', next]
                : x <= END_1 ? ['R', [BEG_2, BEG_2 + x]]            // left to back
                : x <= END_2 ? ['R', [BEG_1, BEG_4 + (x - BEG_2)]]  // top to front
                             : ['U', [x - BEG_3, END_4]]            // right to front
    };

    const dirKeys = Object.keys(moves) as Dir[];
    let dir: Dir = 'R';
    let pos: Pos = [map[0].indexOf('.'), 0];
    for (const step of steps) {
        if (!Number(step))
            dir = dirKeys[(dirKeys.length + dirKeys.indexOf(dir) + (step === 'R' ? 1 : -1)) % dirKeys.length];

        for (let i = 0; i < Number(step); i++) {
            const [nextDir, nextPos] = moves[dir](pos);
            if (mapget(nextPos) === '#') break;
            dir = nextDir;
            pos = nextPos;
        }
    }

    console.log({ pos, dir, pw: 1000 * (pos[1]+1) + 4 * (pos[0]+1) + dirKeys.indexOf(dir)})
}

solve()
// 143208