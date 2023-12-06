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

function* chunk<T>(arr: T[], n: number): Generator<T[], void> {
    for (let i = 0; i < arr.length; i += n) {
      yield arr.slice(i, i + n);
    }
  }

async function solve () {
    let sum = 0;
    let group: string[] = []
    // const file = fs.readFileSync('3.in', 'utf-8').split(/\r?\n/);
    for await (const line of await lineByLine('3.in')) {
        group.push(line)
        if (group.length == 3) {
            const [one, two, three] = group.map(line => line.split(''));
            const commonList = one.filter(v => two.includes(v)).filter(v => three.includes(v))
            const commonLetter = commonList[0]
            const asciiScoreModifier = commonLetter > 'Z' ? 96 : 38; // diff from ascii code to score
            sum += commonLetter.charCodeAt(0) - asciiScoreModifier
            group = []
        }
    }
    return sum;
}

solve().then(console.log)