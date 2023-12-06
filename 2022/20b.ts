import { readFileSync } from "fs"
import { range } from "./lib/array"

async function solve() {
    const original = readFileSync('20.in', 'utf-8').split('\n').map(v => 811589153 * Number(v));
    const list = Array.from(original, (_, index) => index); // list of references to original

    range(1, 10).forEach(_ => {
        original.forEach((move, i) => {
            const pos = list.indexOf(i);
            // Wrap around had silly off by one errors here..
            list.splice(pos, 1);
            list.splice(pos + move - Math.floor((pos + move) / (list.length)) * (list.length), 0, i);
        });
    });

    const zeroPos = list.indexOf(original.indexOf(0));
    return [1000,2000,3000].reduce((prev, x) => 
        prev + original[list[(zeroPos + x) % list.length]], 0);
}

solve().then(console.log)

/*
-1106196015539
3122995060744
5479849961056
7496649006261 < answer pt 2
*/