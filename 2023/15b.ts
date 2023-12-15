import { fileAsString } from "./lib/file.ts";
import { protosArray } from "./lib/array.ts";
import { protosString } from "./lib/string.ts";
protosArray(); protosString();

type SSA = [string, string][];
const items = fileAsString('15.in').split(',');
const boxes = Array.from({ length: 256 }, () => [] as SSA);

for (const line of items) {
    const [code, num] = line.split(/[=-]/);
    const bi  = code.map(c => c.charCodeAt(0)).reduce((prev, ascii) => (prev + ascii) * 17 % 256, 0);

    const box = boxes[bi];
    const pos = box.findIndex(v => v[0] === code);
    const idx = pos >= 0 ? pos : box.length;
    const add = line.includes('=') ? [[code, num]] as SSA : [];
    box.splice(idx, 1, ...add); // At position `idx`, remove 1 (if any exist), and replace with `add` (if not empty)
}

const result = boxes.map((box, bi) => box.reduce((prev, [_code, num], pos) => prev + (+num * (pos+1) * (bi+1)), 0)).sum();
console.log({ result });
// 265462