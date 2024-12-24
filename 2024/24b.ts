import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const OP = 1, OUT = 4;
const ops = File.lines("24.in").filter(v=>v).map(l => l.split(/:? /)).filter(arr => arr.length > 2);
const opsMap = Object.fromEntries(ops.map(([a, op, b, _, out]) => [out, [a, op, b]]));
const zeds = ops.filter(op => op[OUT].startsWith('z')).map(op => op[OUT]).sort();
const pairs: string[][] = [];
const swap = <T>(v: T, _swap: unknown): T => v;

// What good looks like for binary addition:
// z02 = x02 XOR y02 XOR carry01
// carry02 = (x02 AND y02) OR (carry01 AND (x02 XOR y02))
// carry01 = (x01 AND y01) OR (carry00 AND (x01 XOR y01))
// carry00 = x00 AND y01

// 1st pass: First operation is wrong
zeds.forEach(zed => {  
    if (['z00', 'z45'].includes(zed)) return; // These different but good
    if (opsMap[zed][1] !== 'XOR') {
        const x = zed.replace('z', 'x');
        const inputxor = ops.find(([a,op,b]) => op === 'XOR' && (a===x || b===x))!;
        const outputxor = ops.find(([a,op,b]) => op === 'XOR' && (a===inputxor[OUT] || b===inputxor[OUT]))!;
        pairs.push([zed, outputxor[OUT]]);
        opsMap[outputxor[OUT]] = swap(opsMap[zed], opsMap[zed] = opsMap[outputxor[OUT]]);
        return;
    }
})

// 2nd pass: one of the second operations is wrong
zeds.forEach(zed => {
    if (['z00', 'z01', 'z45'].includes(zed)) return; // These different but good

    const [a, _op, b] = opsMap[zed];
    if ([opsMap[a][OP], opsMap[b][OP]].sort().join() !== 'OR,XOR') {
        const wrong = ['OR', 'XOR'].includes(opsMap[a][OP]) ? b : a;
        const missingOp = ['OR', 'XOR'].filter(op => opsMap[a][OP] !== op && opsMap[b][OP] !== op)[0];
        const right = ops.find(([a,op,b]) => missingOp === op && [a, b].includes(opsMap[wrong][0]))!;
        pairs.push([wrong, right[OUT]]);
        return;
    }
})

console.log(pairs.flat().sort().join()); // kcd,pfn,shj,tpk,wkb,z07,z23,z27.
