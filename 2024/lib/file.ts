import * as fs from 'node:fs';
import * as readline from 'node:readline';
import { transposeMatrix } from './matrix.ts';


export const fileAsString = (filename: string) => fs.readFileSync(filename, 'ascii');
export const fileAsLines = (filename: string) => fs.readFileSync(filename, 'ascii').replace(/\n$/, '').split(/\n/);
export const fileAsTuples = (filename: string) => fileAsLines(filename).map(l => l.split(/ +/));
export const fileAsNumbers = (filename: string) => fileAsLines(filename).map(row => [...row.matchAll(/-?\d+/g)].map(({0: num}) => Number(num)));

export const readAllLines = fileAsLines;


export const fileAsMatchGroups = (filename: string, re: RegExp): Record<string, string>[] => {
  const file = fileAsLines(filename);
  return file.map(line => {
      const m = re.exec(line);
      if (!m) {
          throw new Error(`Line [${line}] does not match ${re}`)
      }
      return m.groups!;
  })
};

export const fileAsMatches = (filename: string, re: RegExp): string[][] => {
  const file = fileAsLines(filename);
  return file.map(line => {
      const m = re.exec(line);
      if (!m) {
          throw new Error(`Line [${line}] does not match ${re}`)
      }
      return m.splice(1);
  })
};


export function lineByLine(filename: string) {
    const fileStream = fs.createReadStream(filename);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    return rl
  }

export const File = {
  string: fileAsString,
  lines: readAllLines,
  tuples: fileAsTuples,
  numberList: (file: string) => fileAsNumbers(file).flat(),
  numberTable: fileAsNumbers,
  regexGroups: fileAsMatchGroups,
  regex: fileAsMatches,
  lineByLine,
  charMatrix: (file: string) => fileAsLines(file).map(line => [...line]),
  numberMatrix: (file: string) => fileAsLines(file).map(line => [...line.map(v => parseInt(v, 10))]),
  columns: (file: string) => transposeMatrix(fileAsLines(file).map(line => [...line])),
};