import * as fs from 'fs';
import * as readline from 'readline';

async function lineByLine(filename: string) {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  return rl
}

async function solve () {
    let n = 0;
    let sum = 0;
    for await (const line of await lineByLine('3.in')) {
        const one = line.substring(0, line.length / 2).split('')
        const two = line.substring(line.length / 2, line.length).split('')
        const commonList = one.filter(v => two.includes(v))
        const commonLetter = commonList[0]
        const asciiScoreModifier = commonLetter > 'Z' ? 96 : 38; // diff from ascii code to score
        sum += commonLetter.charCodeAt(0) - asciiScoreModifier
    }
    return sum;
}

solve().then(console.log)