import { readFileSync } from "node:fs";
import { findLastIndex } from "./lib/array.ts";


type Dir = 'R' | 'L' | 'U' | 'D';
type Pos = [number, number];

function solve () {
    const [map_, steps_] = readFileSync('22.in', 'ascii').split(/\n\n/);
    const steps = steps_.split(/([LR])/)
    const map = map_.split('\n').map(row => row.split(''));
    map.forEach(row => console.log(row.join('')))

    const mapset = ([x, y]: Pos, v: string) => map[y][x] = v;
    const mapget = ([x, y]: Pos) => map[y] ? map[y][x] ?? ' ' : ' ';
    const firstInRow = (y: number) => map[y].findIndex(v => !!v && v !== ' ');
    const lastInRow = (y: number) => findLastIndex(map[y], v => !!v && v !== ' ');
    const firstInColumn = (x: number) => map.map(row => row[x]).findIndex(v => !!v && v !== ' ');
    const lastInColumn = (x: number) => findLastIndex(map.map(row => row[x]), v => !!v && v !== ' ');

    const dirs: Record<Dir, { icon: string, move: (z: Pos) => Pos}> = {
        'R': {
            icon: '>',
            move: ([x, y]) => mapget([x+1, y]) === ' ' ? [firstInRow(y), y] : [x+1, y],
        },
        'D': {
            icon: 'v',
            move: ([x, y]) => mapget([x, y+1]) === ' ' ? [x, firstInColumn(x)] : [x, y+1],
        },
        'L': {
            icon: '<',
            move: ([x, y]) => mapget([x-1, y]) === ' ' ? [lastInRow(y), y] : [x-1, y],
        },
        'U': {
            icon: '^',
            move: ([x, y]) => mapget([x, y-1]) === ' ' ? [x, lastInColumn(x)] : [x, y-1],
        },
    };

    const dirKeys = Object.keys(dirs) as Dir[];
    let dir: Dir = 'R';
    
    let pos: Pos = [map[0].indexOf('.'), 0];
    console.log({steps, pos});
    try {
        for (const step of steps) {
            // map.forEach(row => console.log(row.join('')))
            // console.log({ pos, next: dirs[dir].move(pos), step });
            if (step === 'R') {
                dir = dirKeys[(dirKeys.indexOf(dir) + 1) % dirKeys.length];
                mapset(pos, dirs[dir].icon);
            } else if (step === 'L') {
                dir = dirKeys[(dirKeys.length + dirKeys.indexOf(dir) - 1) % dirKeys.length];
                mapset(pos, dirs[dir].icon);
            } else {
                for (let i = 0; i < Number(step); i++) {
                    const nextPos = dirs[dir].move(pos);
                    if (mapget(nextPos) === '#') {
                        break;
                    }
                    if (mapget(nextPos) === ' ') {
                        break;
                    }

                    mapset(pos, dirs[dir].icon);
                    pos = nextPos;
                }
            }
        }
    } finally {
        map.forEach(row => console.log(row.join('')))
        console.log({ pos, dir });//, next: dirs[dir].move(pos) });
    }

    console.log({ pos, dir, pw: 1000 * (pos[1]+1) + 4 * (pos[0]+1) + dirKeys.indexOf(dir)})
}

solve()