import { lineByLine } from "./file";
import { range } from "./lib/array";

async function solve() {
    const START = [500, 0];
    const map: number[][] = [];
    let maxY = -Infinity;
    let floorY = -Infinity;

    const mapset = (x: number) => (y: number) => {
        map[x] ??= [];
        // console.log(x, y, 1)
        map[x][y] = 1;
    }

    const isEmptyOnMap = (x: number, y: number) => y < floorY && !(map[x] && map[x][y])

    for await  (const line of await lineByLine('14.in')) {
        let px = 0, py = 0;
        for (const [x, y] of line.split(' -> ').map(s => s.split(',').map(v => parseInt(v, 10)))) {
            if (px && py) {
                range(px, x).forEach(X => range(py, y).forEach(mapset(X)))
            }

            px = x; py = y;
            if (y > maxY) { maxY = y }
        }
    }

    floorY = maxY + 2;
    console.log(maxY)

    let particleCount = 0;
    while (++particleCount) {
        console.log('Particle', particleCount);

        let [x, y] = START;
        while (1) {
            let [nextX, nextY] = 
                isEmptyOnMap(x, y+1) ?  [x, y + 1] :
                isEmptyOnMap(x - 1, y + 1) ? [x - 1, y + 1] :
                isEmptyOnMap(x + 1, y + 1) ? [x + 1, y + 1] :
                [x, y];

            if (nextX === x && nextY === y) {
                if (x === START[0] && y === START[1]) {
                    console.log(particleCount);
                    return;
                }

                mapset(nextX)(nextY);
                break;
            }

            // console.log([x, y], ' to ', [nextX, nextY]);

            [x, y] = [nextX, nextY];
        }
    }
}


solve();