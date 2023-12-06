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
    let sum = 0;
    let group: string[] = []
    let parsingState = true
    const state: Record<number, Array<string>> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
    }

    for await (const line of await lineByLine('5.in')) {
        if (parsingState) {
            if (line === '') {
                parsingState = false;
                console.log(state)
                continue;
            }

            line.match(/.{3} ?/g)?.forEach((v, index) => {
              if (v[0] === '[') {
                state[index + 1].push(v[1])
              }
            })
        } else {
          const m = line.match(/move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)/);
          if (!m) {throw new Error('match failed: ' + line)}
          const [count, from, to] = m.slice(1).map(v => parseInt(v, 10));
          console.log(m, count, from, to);
          const crates = state[from].splice(0, count);
          state[to].unshift.apply(state[to], crates.reverse())
          console.log(state)
        }
    }

    return Object.values(state).map(list => list[0]).join('')
    // return sum;
}

solve().then(console.log)