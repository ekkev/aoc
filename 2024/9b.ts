import { rangeExclusive } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

type Item = { type: "f" | "g"; start: number; len: number; id: number };

let start = 0;
const [files, gaps] = File.charMatrix("9.in")[0].map((len, i) => {
  const el: Item = { type: (i % 2) ? "g" : "f", len: parseInt(len), id: i / 2, start };
  start += parseInt(len);
  return el;
}).split(({type}) => type === "f");

files.toReversed().forEach(file => {
  const gap = gaps.find(({ len, start }) => len >= file.len && start < file.start);
  if (gap) {
    file.start = gap.start;
    gap.len -= file.len; // Reduce size
    gap.start += file.len; // Start later
  }
});

const res = files.map(({ len, id, start }) => rangeExclusive(start, start + len).sum() * id)
                 .sum();

console.log({ res }); // 6382582136592
