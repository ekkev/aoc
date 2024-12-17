import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const instructions = File.numberList('17.in').slice(3);
const instr = instructions.join('');
const candidates: Record<number, bigint[]> = {};
let found = 0n;

for (let pos = 0; pos < instr.length; pos++) {
  if (!candidates[pos]) candidates[pos] = [];

  for (let j = 0; j <= 0b111; j++) {
    const a = found | (BigInt(j) << BigInt(3 * (instr.length - pos - 1)));
    const out: bigint[] = [];
    let [A, B, C, instPtr] = [a, 0n, 0n, 0];

    for (; instPtr < instructions.length - 1; instPtr += 2) {
      const op = BigInt(instructions[instPtr + 1]);
      const combo = { 4: A, 5: B, 6: C }[op.toString()] ?? op;
      switch (instructions[instPtr]) {
        case 0: A = A / 2n ** combo; break;
        case 1: B ^= op; break;
        case 2: B = combo & 0b111n; break;
        case 3: A && (instPtr = Number(op) - 2); break;
        case 4: B ^= C; break;
        case 5: out.push(combo & 0b111n); break;
        case 6: B = A / 2n ** combo; break;
        case 7: C = A / 2n ** combo; break;
      }
    }

    if (out.join('').endsWith(instr.slice(-pos - 1)))
      candidates[pos].push(a);
  }

  while (!candidates[pos].length) pos--;
  found = candidates[pos].shift()!;
}

console.log({ oct: found.toString(8), res: found.toString(10) }); // 106086382266778 === 0o3007605110264632