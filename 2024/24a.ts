import { sortCompareStringcDesc } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const [values, ops] = File.lines("24.in").filter(v=>v).map(l => l.split(/:? /)).split(arr => arr.length===2);
const valueMap = new Map(values.map(([k, v]) => [k, Number(v)]));
let zRemCount = ops.filter(([_a, _op, _b, _, out]) => out.startsWith('z')).length;

const Ops = {
    AND: (a: number, b: number) => a & b,
    OR: (a: number, b: number) => a | b,
    XOR: (a: number, b: number) => a ^ b,
}

type Op = keyof typeof Ops;
const doOp = (op: Op, a: number, b: number): number => Ops[op](a, b);

while (zRemCount) {
    ops.forEach(([a, op, b, _, out]) => {
        valueMap.has(a) && valueMap.has(b) && !valueMap.has(out)
        && valueMap.set(out, doOp(op as Op, valueMap.get(a)!, valueMap.get(b)!))
        && out.startsWith('z') && zRemCount--;
    });
}

const res = BigInt('0b' + [...valueMap.entries()]
        .filter(([k]) => k.startsWith('z'))
        .sort(([ka], [kb]) => sortCompareStringcDesc(ka, kb))
        .map(([_k, v]) => v)
        .join(''));

console.log({ res }); // 57588078076750


