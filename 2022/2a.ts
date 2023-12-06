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

const shapePoints = {
    'X': 1, // rock
    'Y': 2, // paper
    'Z': 3, // scissors
}

const winPoints = {
    'X': { // rock
        'A': 3, // r
        'B': 0, // p
        'C': 6, // s
    },
    'Y': { // paper
        'A': 6, // rock
        'B': 3, // paper
        'C': 0, // scissors
    },
    'Z': { // scissors
        'A': 0, // rock
        'B': 6, // paper
        'C': 3, // scissors
    },
}

async function main () {
    let n = 0;
    let sum = 0;
    for await (const line of await lineByLine('2.in')) {
        const [them, me] = line.split(' ') as ['A' | 'B' | 'C', 'X' | 'Y' | 'Z'];
        sum += shapePoints[me] + winPoints[me][them];
    }
    return sum;
}

main().then(console.log)