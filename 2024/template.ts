import { File } from "./lib/file.ts";
import { protosArray } from "./lib/array.ts";
import { protosString } from "./lib/string.ts";
protosArray();
protosString();

const FILE = `${(new Date()).getDate()}.in`;
const lines = File.lines(FILE);
const tuples = File.tuples(FILE);
const nums = File.numberList(FILE);
//const matches = File.regex(FILE, /(...)/);
const file = File.string(FILE);

let res = 0;





console.log({ tuples, res });


