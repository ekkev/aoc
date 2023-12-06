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

// In how many assignment pairs does one range fully contain the other?
async function solve () {
    let n = 0;
    let sum = 0;
    for await (const line of await lineByLine('4.in')) {
        const [astart, aend, bstart, bend] = line.split(/[-,]/).map(v => parseInt(v, 10)) as [number, number, number, number]
        console.log(astart, aend, bstart, bend)

        if ((astart <= bstart && aend >= bend)
            || (bstart <= astart && bend >= aend)) {
            sum++
        }
    }
    return sum;
}

solve().then(console.log)