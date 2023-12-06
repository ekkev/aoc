import { lineByLine } from './file'

// How many positions does the tail of the rope visit at least once?
async function solve () {
    let rows: number[][] = [];

    let [Sx, Sy, Ex, Ey] = [NaN, NaN, NaN, NaN]; // ...batman
    let charCodeOffset = 'a'.charCodeAt(0);

    for await (const line of await lineByLine('12.in')) {
        rows.push(line.split('').map(v => v.charCodeAt(0) - charCodeOffset));
        if (line.indexOf('S') > -1) {
            Sx = line.indexOf('S');
            Sy = rows.length - 1;
            rows[Sy][Sx] = 'a'.charCodeAt(0) - charCodeOffset; // = 1
        }
        if (line.indexOf('E') > -1) {
            Ex = line.indexOf('E');
            Ey = rows.length - 1;
            rows[Ey][Ex] = 'z'.charCodeAt(0) - charCodeOffset;
        }
    }

    // costwise breadth-first search
    type QueueItem = {
        x: number,
        y: number,
        path: string[],
    };

    type Coords = [number, number];

    let priorityQueue: Array<QueueItem> = [{x: Ex, y: Ey, path: []}];

    const allMoves = (x: number, y: number): Coords[] => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
    const isWithinBounds = ([x, y]: Coords): boolean => !(x < 0 || y < 0 || x >= rows[0].length || y >= rows.length);
    const isValidMove = (x2: number, y2: number) => ([x, y]: Coords) => !(rows[y2][x2] - rows[y][x] > 1)
    const isNotQueued = ([x, y]: Coords) => priorityQueue.findIndex(item => (item.x === x && item.y === y)) === -1
    const validMoves = (el: QueueItem) =>  allMoves(el.x, el.y)
                                                        .filter(isWithinBounds)
                                                        .filter(isValidMove(el.x, el.y))
                                                        .filter(isNotQueued);

    const addToPriorityQueueWithPath = (path: string[]) => ([x, y]: Coords) => {
        const pos = priorityQueue.findIndex(item => item.path.length > path.length);
        priorityQueue.splice(pos === -1 ? priorityQueue.length : pos, 0, { x, y, path });
    }

    const isGoalHit = (el: QueueItem): boolean => rows[el.y][el.x] === 'a'.charCodeAt(0) - charCodeOffset; // 12b
        //  (el.y === Sy && el.x === Sx) { // 12a

    let el: QueueItem | undefined;
    while (el = priorityQueue.shift()) {
        if (isGoalHit(el)) {
            console.log(el);
            return el.path.length;
        }

        validMoves(el).forEach(addToPriorityQueueWithPath([...el.path, `${el.x}:${el.y}`]))
    }
}

solve().then(console.log) // 377