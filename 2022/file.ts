import * as fs from 'node:fs';
import * as readline from 'node:readline';



export async function lineByLine(filename: string) {
    const fileStream = fs.createReadStream(filename);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    return rl
  }