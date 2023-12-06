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
    'R': 1, // rock
    'P': 2, // paper
    'S': 3, // scissors
}

const outcomePoints = {
    X: 0, // lose
    Y: 3, // draw
    Z: 6, // win
}

const moves = {
    X: { // lose
        A: 'S', // rock
        B: 'R', // paper
        C: 'P', // scissors
    },
    Y: { // draw
        A: 'R', // rock
        B: 'P', // paper
        C: 'S', // scissors
    },
    Z: { // win
        'A': 'P', // rock
        'B': 'S', // paper
        'C': 'R', // scissors
    },
}

async function main () {
    let n = 0;
    let sum = 0;
    for await (const line of await lineByLine('2.in')) {
        const [them, outcome] = line.split(' ') as ['A' | 'B' | 'C', 'X' | 'Y' | 'Z'];
        const me = moves[outcome][them] as 'R'|'P'|'S'
        sum += shapePoints[me] + outcomePoints[outcome];
    }
    return sum;
}

main().then(console.log)