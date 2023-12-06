import { readFileSync } from "fs";

async function solve() {
    const pixels = readFileSync('18.in', 'utf-8').split(/\n/).map(row => row.split(',').map(s => parseInt(s)));
    let overlaps = 0;
    for (let i = 0; i < pixels.length; i++) {
        for (let j = 0; j < i; j++) {
            // Two sides same
            if (2 === ((pixels[i][0] === pixels[j][0])?1:0) + ((pixels[i][1] === pixels[j][1])?1:0) + ((pixels[i][2] === pixels[j][2])?1:0)) {
                // abs difference 1 pixel == sharing a side
                if (1 === Math.abs((pixels[i][0]+pixels[i][1]+pixels[i][2]) - (pixels[j][0]+pixels[j][1]+pixels[j][2]))) {
                    overlaps += 2;
                }
            }
        }
    }
    
    console.log(pixels, overlaps)
    return pixels.length*6 - overlaps;
}


solve().then(console.log)

// pt 1: 4628
