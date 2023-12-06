import { lineByLine } from './file'

// How many positions does the tail of the rope visit at least once?
async function solve () {
    let X = 1;
    let cycle = 0;
    let sum = 0;
    let screen = '';

    for await (const line of await lineByLine('10.in')) {
        let cyclesInInstruction = 1;

        let modify = () => {};
        let m;
        if (m = line.match(/^addx (?<num>\-?\d+)$/)) {
            if (typeof m.groups === 'undefined') {
                throw new Error('parse ' + line)
            }
            const num = parseInt(m.groups.num, 10);

            cyclesInInstruction = 2;
            modify = () => X += num;
        }

        for (let i = 0; i < cyclesInInstruction; i++) {
            const isLit = Math.abs(X - (cycle%40)) <= 1
            screen += isLit ? '#' : ' '

            cycle++;
            console.log(cycle, X, isLit)
        }

        modify();
    }

    console.log(screen.match(/.{40}/g))

    return screen;
}

solve().then(console.log)