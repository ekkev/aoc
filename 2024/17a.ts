import { File, globalProtos } from "./lib/index.ts";
globalProtos();

let [A, B, C, ...instructions] = File.numberList('17.in');
const out: number[] = [];

for (let inst = 0; inst < instructions.length - 1; inst += 2) {
  const op = instructions[inst + 1];
  const combo = { 4: A, 5: B, 6: C }[op] ?? op;

  switch (instructions[inst]) {
    case 0: A = Math.floor(A / 2 ** combo); break;
    case 1: B ^= op; break;
    case 2: B = combo & 0b111; break;
    case 3: A && (inst = op - 2); break;
    case 4: B ^= C; break;
    case 5: out.push(combo & 0b111); break;
    case 6: B = Math.floor(A / 2 ** combo); break;
    case 7: C = Math.floor(A / 2 ** combo); break;
  }
}

console.log({ res: out.join() }); // 6,5,4,7,1,6,0,3,1