import { File, globalProtos } from "./lib/index.ts";
import { ints } from "./lib/string.ts";
globalProtos();

const text = File.lines(`3.in`).join("");

const res = [...text.matchAll(/(^|do\(\))(.*?)($|don\'t\(\))/g)]
  .map((m) =>
    [...m[2].matchAll(/mul\((\d{1,3},\d{1,3})\)/g)].map((m2) =>
      ints(m2[1]).product()
    ).sum()
  ).sum();

  console.log({ res }); // 67269798
