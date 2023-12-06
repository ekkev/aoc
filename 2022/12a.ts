import { lineByLine } from './file'

// How many positions does the tail of the rope visit at least once?
async function solve () {
    let rows: number[][] = [];

    let [Sx, Sy, Ex, Ey] = [-1,-1,-1,-1];

    for await (const line of await lineByLine('12.in')) {
        rows.push(line.split('').map(v => v.charCodeAt(0)-96));
        if (line.indexOf('S') > -1) {
            Sx = line.indexOf('S');
            Sy = rows.length - 1;
            rows[Sy][Sx] = 'a'.charCodeAt(0) - 96; // = 1
        }
        if (line.indexOf('E') > -1) {
            Ex = line.indexOf('E');
            Ey = rows.length - 1;
            rows[Ey][Ex] = 'z'.charCodeAt(0) - 96;
        }
    }

    // costwise breadth-first search
    type QueueItem = {
        x: number,
        y: number,
        cost: number
    };

    let costQueue: Array<QueueItem> = [{x: Ex, y: Ey, cost: 0}];
    for (const el of costQueue) {
        // Goal!
        if (el.y === Sy && el.x === Sx) { // 12a
            return el;
        }

        const cur = rows[el.y][el.x];

        // Add possible legal moves to queue
        for (const [x, y] of   [[el.x + 1, el.y],
                                [el.x - 1, el.y],
                                [el.x, el.y + 1],
                                [el.x, el.y - 1]]
        ) {
            // Over the edge
            if (x < 0 || y < 0 || x >= rows[0].length || y >= rows.length) {
                continue;
            }

            // Invalid move
            if (cur - rows[y][x] > 1) {
                continue;
            } 

            if (costQueue.findIndex(item => (item.x === x && item.y === y)) == -1) {
                const cost = el.cost + 1;
                const pos = costQueue.findIndex(item => item.cost > cost);
                if (pos === -1) { // costliest to the end
                    costQueue.push({ x, y, cost });
                } else {
                    costQueue.splice(pos, 0, { x, y, cost });
                }
            }
        }
    }
    
}

solve().then(console.log) // { x: 0, y: 20, cost: 383 }