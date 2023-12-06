import { lineByLine } from "./file";
import { range } from "./lib/array";

async function solve() {

    const RowY = 2000000;

    const rowhits: Set<number> = new Set();
    const rowbeacons: Set<number> = new Set();

    for await  (const line of await lineByLine('15.in')) {
        const m = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/);
        if (!m) {
            throw new Error('parse: ' + line);
        }

        const [_, Sx, Sy, Bx, By] = [...m].map(v => parseInt(v, 10));
        console.log({Sx, Sy, Bx, By});

        if (By === RowY) {
            rowbeacons.add(Bx);
        }

        if (Sy === RowY) {
            rowbeacons.add(Sx);
        }

        // Mark where beacon-signal area is covered in target row (ROWNR)
        const distance = Math.abs(Sx - Bx) + Math.abs(Sy - By);
        const distanceToRow = Math.abs(Sy - RowY);
        for (let step = 0; step <= (distance - distanceToRow); step++) {
            rowhits.add(Sx + step);
            rowhits.add(Sx - step);

            // console.log(distance, distanceToRow, Sx + step, Sx - step);
        }
    }

    rowbeacons.forEach(x => rowhits.delete(x));
    console.log(rowhits.size);
}

solve();