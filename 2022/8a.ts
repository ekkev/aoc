import { readFileSync } from 'fs';

async function solve () {

    let visibleTrees = 0;

    const lines = readFileSync('8.in', 'utf-8').split(/\n+/);

    let lineNumber = 0
    for (const line of lines) {
        // Look up preload
        const linesBefore = lines.slice(0, lineNumber);
        const linesAfter = lines.slice(lineNumber + 1);

        // Visible = all trees on one direction are smaller than current height
        line.split('').forEach((height, colNumber) => {
            // Look left
            if (maxInString(line.substring(0, colNumber)) < height) {
                visibleTrees++;
                return;
            }

            // Look right
            if (maxInString(line.substring(colNumber + 1)) < height) {
                visibleTrees++;
                return;
            }

            // Look up
            if (maxInList(linesBefore.map(line => line[colNumber])) < height) {
                visibleTrees++;
                return;
            }

            // Look down
            if (maxInList(linesAfter.map(line => line[colNumber])) < height) {
                visibleTrees++;
                return;
            }
        })

        lineNumber++;
    }

    return visibleTrees;
}

const maxInString = (str: string): string => maxInList(str.split(''));
const maxInList = (list: string[]): string => Math.max.apply(null, list as any as number[]).toString();



solve().then(console.log)