import * as fs from 'node:fs';
import * as readline from 'node:readline';


export const readAllLines = (filename: string) => fs.readFileSync(filename, 'ascii').split(/\n/);
export const fileAsLines = (filename: string) => fs.readFileSync(filename, 'ascii').split(/\n/);
export const fileAsNumbers = (filename: string) => fileAsLines(filename).map(row => [...row.matchAll(/\d+/g)].map(({0: num}) => Number(num)));

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


export async function lineByLine(filename: string) {
    const fileStream = fs.createReadStream(filename);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    return rl
  }