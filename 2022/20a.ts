import { readFileSync } from "fs"

async function solve() {
    const original = readFileSync('20.in', 'utf-8').split('\n').map(Number);
    const list = [...original].map((v, i) => i); // list of references to original

    original.forEach((move, i) => {
        const pos = list.indexOf(i);
        // Wrap around had silly off by one errors here..
        list.splice(pos, 1);
        list.splice(pos + move - Math.floor((pos + move) / (list.length)) * (list.length), 0, i);
    });

    const zeroPos = list.indexOf(original.indexOf(0));
    return [1000,2000,3000].reduce((prev, x) => 
        prev + original[list[(zeroPos + x) % list.length]], 0);
}

solve().then(console.log) // 4224