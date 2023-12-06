import { lineByLine } from './file.ts'

// How many positions does the tail of the rope visit at least once?
async function solve () {
    const KNOTS = 10;
    
    const x = Array.from(Array(KNOTS), () => 0);
    const y = Array.from(Array(KNOTS), () => 0);

    const tailpositions = new Set(['0,0']);

    const xstep = {
        U: 0,
        D: 0,
        R: 1,
        L: -1,
    };

    const ystep = {
        U: 1,
        D: -1,
        R: 0,
        L: 0,
    }

    for await (const line of await lineByLine('9.in')) {
        const [direction, steps] = line.split(' ') as ['U' | 'D' | 'R' | 'L', string];
        
        const Dx = xstep[direction];
        const Dy = ystep[direction];
        for (let i = 0; i < parseInt(steps, 10); i++) {
            x[0] += Dx; // Move head
            y[0] += Dy;

            for (let n = 1; n < KNOTS; n++) {
                const touchingPrevious = Math.abs(x[n-1] - x[n]) <= 1 && Math.abs(y[n-1] - y[n]) <= 1;
                if (!touchingPrevious) {
                    // Move diagonally (or straight, if same row/col) towards previous knot
                    y[n] += (y[n-1] == y[n]) ? 0 : ((y[n-1] > y[n]) ? 1 : -1);
                    x[n] += (x[n-1] == x[n]) ? 0 : ((x[n-1] > x[n]) ? 1 : -1);

                    if (n === KNOTS - 1) {
                        tailpositions.add(`${x[n]},${y[n]}`);   
                    }
                }
            }
        }
    }

    return tailpositions.size;
}

solve().then(console.log)