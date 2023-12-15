import { fileAsString } from "./lib/file.ts";

const items = fileAsString('15.in').split(',');

let result = 0;
for (const it of items) {
    let ans = 0;
    for (let i = 0; i < it.length; i++) {
        ans += it.charCodeAt(i);
        ans *= 17;
        ans %= 256;
    }
    result += ans;
}
console.log({result})
// 508552