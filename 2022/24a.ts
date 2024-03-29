import { readFileSync } from "node:fs";


const map = readFileSync('24.in', 'ascii').split(/\n/).map(row => row.replaceAll('#', ''));
map.shift(); map.pop();

const targetX = map[0].length - 1;
const targetY = map.length - 1;

type XY = [number, number];

const MAX_WRAPS = 10000;
const allmoves = ([x, y]: XY) => [[x+1, y], [x-1, y], [x, y], [x, y+1], [x, y-1]].filter(([x, y]) => (x === 0 && y === -1) || (x === targetX && y === targetY + 1) || (x >= 0 && x <= targetX && y >= 0 && y <= targetY)) as XY[];
const mapget = ([x, y]: XY) => map[((targetY+1)*MAX_WRAPS + y) % (targetY+1)][((targetX+1)*MAX_WRAPS + x) % (targetX+1)];
const avoidswind = (minute: number) => ([x, y]: XY) => 
    // Calculate wind position from 4 directions by `minute`
    // Right - is wind facing left in N positions, wrapping around
    (x === 0 && y === -1) || 
    (x === targetX && y === targetY + 1) || !(mapget([x + minute, y]) === '<'
    || mapget([x - minute, y]) === '>'
    || mapget([x, y + minute]) === '^'
    || mapget([x, y - minute]) === 'v');

const solve = (start: XY, end: XY) => {
    let minute = 0;
    let posq: XY[] = [start];
    do {
        const next: Record<string, XY> = {};

        for (const pos of posq) {
            if (pos[0] === end[0] && pos[1] === end[1]) {
                return minute;
            }

            allmoves(pos).filter(avoidswind(minute + 1)).forEach(move => {
                next[move.join(',')] = move;
            });
        }
        
        posq = Object.values(next);
    } while (posq.length && minute++ < 350)
}

console.log(solve([0, -1], [targetX, targetY + 1]));
// 308