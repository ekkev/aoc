import { sum } from "./lib/array.ts";
import { fileAsLines } from "./lib/file.ts";
import { tupleGroupByKey } from "./lib/tuple.ts";


const lines = fileAsLines('7.in').map(line => line.split(' ') as [string, string]);

const strength = Object.fromEntries(lines.map(v => [v[0], 0] as [string, number]));

const sortmap: Record<string, string> = {'A' : 'e', 'K': 'd', 'Q': 'c', 'J': 'b', 'T': 'a', '9': '9', '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2'};

for (const [card] of lines) {
    let score = 0;

    const kind2 = card.match(/(.).*\1/)
    if (kind2) {
        score = 1;
        if (/(.).*\1/.test(card.replaceAll(kind2[1],''))) {
            score = 2;
        }
    }

    const kind3 = /(.).*?\1.*?\1/.test(card);
    if (kind3) score = 3;

    let house = false;
    const hm = card.match(/(.).*?\1.*?\1/);

    if (hm) {
        const hc = hm[1];
        if (/(.)\1/.test(card.replaceAll(hc, ''))) {
            house = true;
        }
    }
    if (house) score = 4;

    const kind4 = /(.).*?\1.*?\1.*?\1/.test(card);
    if (kind4) score = 5;

    const kind5 = /(.)\1\1\1\1/.test(card);
    if (kind5) score = 6;

    strength[card] = score;
}

const strToCards = Object.entries(strength).map(([card, str]) => [str, card] as [number, string])
const strGroups  = tupleGroupByKey(strToCards).sort((a,b) => Number(a[0]) - Number(b[0])) ;

const repl = (s: string) => 
    s.split('').map(c => sortmap[c] as string).join('')

const ranks = Object.fromEntries(lines.map(v => [v[0], 0] as [string, number]));
const bids = Object.fromEntries(lines);

let rank = 0;
for (const [_, list] of strGroups) {
    const sortedCards = (list as string[]).sort((a,b) =>  repl(a).localeCompare(repl(b)));
    
    for (const card of sortedCards) {
        rank++;
        console.log({card, str:strength[card], rank, bid: bids[card]})
        ranks[card] = Number(bids[card]) * rank;
    }
}

console.log({tot:sum(Object.values(ranks))});
// { tot: 251216224 }
