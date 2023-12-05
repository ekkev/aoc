import { intersect, sum } from "./lib/array.ts";
import { fileAsLines } from "./lib/file.ts";
import { ints } from "./lib/string.ts";

const cards = fileAsLines('4.in')
                    .map(line => line.replace(/.*:/, '').split('|').map(ints))

const cardCounts = cards.map(() => 1);
const winCounts = cards.map(([wins, mine]) => intersect(wins, mine).length);
winCounts.forEach((count, indx) => {
    while (count --> 0) {
        cardCounts[indx + 1 + count] += cardCounts[indx]
    }
});

console.log(sum(cardCounts)); // 5132675


