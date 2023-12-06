import { readFileSync } from 'fs';

// What is the highest scenic score possible for any tree?
async function solve () {

    const lines = readFileSync('8.in', 'utf-8').split(/\n+/);

    let maxScore = 0;
    let lineNumber = 0;
    for (const line of lines) {
        // Look up preload
        const linesBefore = lines.slice(0, lineNumber);
        const linesAfter = lines.slice(lineNumber + 1);

        // Count trees (inclusive) to same height to all directions, multiply as visiblity score
        line.split('').forEach((height, colNumber) => {

            const left = countUntilSmaller(line.substring(0, colNumber).split('')
                .reverse(), height);
            const right = countUntilSmaller(line.substring(colNumber + 1).split(''), height);
            const up = countUntilSmaller(linesBefore.map(line => line[colNumber]).reverse(), height);
            const down = countUntilSmaller(linesAfter.map(line => line[colNumber]), height);
            const score = left * right * up * down;
            if (score > maxScore) {
                maxScore = score;
            }
        })

        lineNumber++;
    }

    return maxScore;
}

const countUntilSmaller = (arr: string[], maxValue: string) => {
    let i = 0;
    for (const el of arr) {
        i++;
        if (el >= maxValue) {
            break;
        }
    }
    return i;
}

solve().then(console.log)