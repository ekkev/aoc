import { lineByLine } from "./file";
import { range } from "./lib/array";

async function solve () {

    const MIN_XY = 0;
    const MAX_XY = 4000000;

    const sensors: {Sx: number, Sy: number, distance: number}[] = []

    for await  (const line of await lineByLine('15.in')) {
        const m = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/);
        if (!m) {
            throw new Error('parse: ' + line);
        }

        const [_, Sx, Sy, Bx, By] = [...m].map(v => parseInt(v, 10));
        sensors.push({Sx, Sy, distance: Math.abs(Sx - Bx) + Math.abs(Sy - By)});
    }

    const parseRow = (y: number) => {
        if (!(y%100000))
            console.log('Row', y);
 
        const ranges: [number, number][] = []

        for (const {Sx, Sy, distance} of sensors) {
            // Track ranges where beacon-signal area is covered in target row
            const distanceToRow = Math.abs(Sy - y);
            const halfRowWidth = distance - distanceToRow;
            ranges.push([
                Sx - halfRowWidth,
                Sx + halfRowWidth
            ]);
        }

        let pos = MIN_XY;
        ranges.sort((a, b) => a[0] - b[0]).forEach(([start, end]) => {
            if (start <= pos + 1 && end > pos) {
                pos = end;
            }
        });

        if (pos < MAX_XY) {
            return pos + 1;
        }
    }

    for (let y = MIN_XY; y <= MAX_XY; y++) {
        const res = parseRow(y);
        if (res !== undefined) {
            return res * 4000000 + y;
        }
    }
}

solve().then(console.log); // 10457634860779