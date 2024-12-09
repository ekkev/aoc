import { rangeExclusive } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
import { ints } from "./lib/string.ts";
globalProtos();

const list = File.charMatrix("9.in")[0].map(ints).flat();
let res = 0, pos = 0, fileIndex = list.length-1;

for (let i = 0; i < list.length; i++) {
    if (i > fileIndex) break;

    let len = list[i];
    if (i%2) { // Gap
        while (len --> 0) {
            res += fileIndex/2 * pos;
            pos++;

            list[fileIndex]--;
            if (!list[fileIndex]) {
                fileIndex -= 2;
                if (i > fileIndex) break;
            }
        }
    } else { // File
        res += rangeExclusive(pos, pos + len).sum() * i/2;
        pos += len;
    }
}

console.log({ res }); // 6353658451014


