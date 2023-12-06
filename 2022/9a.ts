import { lineByLine } from './file.ts'

// How many positions does the tail of the rope visit at least once?
async function solve () {
    let [Hx, Hy, Tx, Ty] = [0, 0, 0, 0];
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
            console.log(direction, i)
            Hx += Dx; // Move head
            Hy += Dy;

            const tailTouchingHead = Math.abs(Hx - Tx) <= 1 && Math.abs(Hy - Ty) <= 1;
            if (!tailTouchingHead) {
                if (Hx == Tx) { // same column
                    Ty += (Hy > Ty) ? 1 : -1;
                } else if (Hy == Ty) { // same row
                    Tx += (Hx > Tx) ? 1 : -1;
                } else {
                    // Move diagonally towards head
                    Ty += (Hy > Ty) ? 1 : -1;
                    Tx += (Hx > Tx) ? 1 : -1;
                }

                tailpositions.add(`${Tx},${Ty}`);
            }
        }


    }

    return tailpositions.size;
}

solve().then(console.log)