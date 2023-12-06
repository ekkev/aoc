import * as fs from 'fs';
import * as readline from 'readline';

async function* readCharacters(filePath: string) {
    const stream = fs.createReadStream(filePath, {
        encoding: 'utf8',
        highWaterMark: 1
    });

    for await (const chunk of stream) {
        for (const character of chunk) {
            yield character;
        }
    }
}


async function solve () {
    const N = 14;
    let lastN: string[] = [];
    let pos = 0;
  
    for await (const chr of await readCharacters('6.in')) {
        ++pos;
        console.log(chr, pos)
        lastN.push(chr);

        if (lastN.length > N) {
            lastN.shift();
        }
        
        if (lastN.length === N) {
            const unique = new Set(lastN)
            if (unique.size === N) {
                break
            }
        }
    }

    
    return pos;
}

solve().then(console.log)