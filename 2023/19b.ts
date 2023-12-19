import { fileAsString } from "./lib/file.ts";
import { protosString } from "./lib/string.ts";
import { protosArray } from "./lib/array.ts";
import { findPathsFlexi } from "./lib/path.ts";
protosArray(); protosString();

const wflow = Object.fromEntries(fileAsString('19.in')
    .split(/\n\n/)[0]
    .split(/\n/)
    .map(r => r.split(/[{,}]/).filter(v=>v))
    .map(([name, ...rstr]) => [name, rstr.map(r => r.split(/([><:])/))]));

const allbits = (1n << 4000n) - 1n;
const itFinder = findPathsFlexi<[string, Record<string, bigint>]>({
    startNodes: [['in', { x: allbits, m: allbits, a: allbits, s: allbits }]],
    endCondition: ([p]) => p === 'A',
    nextMovesFn: ([p, bits]) => {
        const next = [] as Array<[string, Record<string, bigint>]>;
        if (p === 'R') return next;

        for (const [letter, op, val, _, target] of wflow[p].slice(0, -1)) {
            const gt  = op === '>' ? BigInt(val)      : 0n;
            const lte = op === '<' ? BigInt(val) - 1n : 4000n;

            const bitmap = (1n << (lte - gt)) - 1n << gt;
            next.push([target, {...bits, [letter]: bits[letter] & bitmap}])

            bits[letter] &= ~bitmap;
        }

        next.push([wflow[p].at(-1)![0], bits]);
        return next;
    }
});

let result = 0;
for (const v of itFinder) {
    result += Object.values(v.finalElement[1]).map(bint => bint.toString(2).count('1')).product();
}

console.log({result});
//113057405770956