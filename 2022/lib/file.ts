import * as fs from 'node:fs';
import * as readline from 'node:readline';


export const readAllLines = (filename: string) => fs.readFileSync(filename, 'ascii').split(/\n/);

export async function lineByLine(filename: string) {
    const fileStream = fs.createReadStream(filename);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    return rl
  }