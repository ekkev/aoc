import { File, globalProtos } from "./lib/index.ts";
import { rotateMatrix } from "./lib/matrix.ts";
import { matrixFromString } from "./lib/matrix.ts";
globalProtos();

const [keys, locks] = File.string("25.in").split('\n\n')
    .map(s => matrixFromString(s))
    .split(m => m[0][0] === '.')
    .map(g => g.map(m => rotateMatrix(m).map(c => c.count('#'))));

const res = keys.flatMap(key => locks.map(lock => 
    key.every((keyPin, pin) => keyPin + lock[pin] <= 7)
)).count(true);

console.log({ res }); // 3065