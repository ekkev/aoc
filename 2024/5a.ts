import { File, globalProtos } from "./lib/index.ts";
import { ints } from "./lib/string.ts";
globalProtos();

const [rules, updates] = File.string(`5.in`).split("\n\n").map((s) =>
  s.split("\n")
);

const mustBeBefore = (a: number, b: number) => {
  return rules.includes([a, b].join("|"));
};

const res = updates.map(ints).filter((list) =>
  list.every((a, i) => {
    return list.slice(0, i).every((b) => mustBeBefore(b, a)) &&
           list.slice(i + 1).every((b) => mustBeBefore(a, b));
  })
).map((list) => list[Math.floor(list.length / 2)]).sum();

console.log({ res });