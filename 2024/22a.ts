import { rangeInclusive } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const res = File.numberList("22.in").map(num => 
    rangeInclusive(1, 2000).reduce((secret) => {
        secret = (secret ^ (secret * 64n)) % 16777216n;
        secret = (secret ^ (secret / 32n)) % 16777216n;
        secret = (secret ^ (secret * 2048n)) % 16777216n;
        return secret;
    }, BigInt(num)))
    .sum();

console.log({ res }); // 19854248602