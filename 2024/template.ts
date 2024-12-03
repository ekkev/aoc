import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const FILE = `${(new Date()).getDate()}.in`;
const lines = File.lines(FILE);
const tuples = File.tuples(FILE);
const nums = File.numberList(FILE);
//const matches = File.regex(FILE, /(...)/);
const file = File.string(FILE);

let res = 0;


// res = list.count(true);


console.log({ tuples, res });


