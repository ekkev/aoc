import { sum } from "./lib/array.ts";
import { fileAsLines } from "./lib/file.ts";
import { tupleGroupByKey } from "./lib/tuple.ts";


const cards = fileAsLines('7.in').map(line => line.split(' ') as [string, string]);
const strength = Object.fromEntries(cards.map(v => [v[0], 0] as [string, number]));
const sortmap: Record<string, string> = {'A' : 'e', 'K': 'd', 'Q': 'c', 'T': 'a', '9': '9', '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2', 'J': '1'};

for (const [card] of cards) {
    let score = 0;

    const jokers = [...card.matchAll(/J/g)].length;
    if (jokers) {
        console.log(card, jokers)
        switch(jokers) {
            case 1: score = 1; break; // pair
            case 2: score = 3; break; // 3 of a kind
            case 3: score = 5; break; // 4 of a kind
            case 4: score = 6; break; // 5 of a kind
            case 5: score = 6; break; // 5 of a kind
        }
    }

    const kind2 = card.match(/([^J]).*\1/)
    if (kind2) {
        score =  
            ((jokers == 1) ? 3 : // 3 of a kind
                (jokers == 2) ? 5 : // 4 of a kind
                (jokers == 3) ? 6 : 1); // 5 of a kind
        if (/([^J]).*\1/.test(card.replaceAll(kind2[1],''))) {
            score = Math.max(score, jokers ? 4 : 2); // 2 pair -> house with jokers
        }
    }

    const kind3 = /([^J]).*?\1.*?\1/.test(card);
    if (kind3) score = Math.max(score, (jokers == 1) ? 5 :
     (jokers === 2) ? 6 : 3);

    let house = false;
    const hm = card.match(/(.).*?\1.*?\1/);
    if (hm) {
        const hc = hm[1];
        if (/(.)\1/.test(card.replaceAll(hc, ''))) {
            house = true;
        }
    }
    if (house) score = Math.max(score, 4);

    const k4 = /([^J]).*?\1.*?\1.*?\1/.test(card);
    if (k4) score = Math.max(score, 5 + jokers);
 
    const k5 = /(.)\1\1\1\1/.test(card);
    if (k5) score = 6;

    strength[card] = score;
}

const strToCards = Object.entries(strength).map(([card, str]) => [str, card] as [number, string]);
const strGroups  = tupleGroupByKey(strToCards).sort((a,b) => Number(a[0]) - Number(b[0])) ;

const sortReplacer = (s: string) => 
    s.split('').map((c) => sortmap[c] as string).join('')

const ranks = Object.fromEntries(cards.map(v => [v[0], 0] as [string, number]));
const bids = Object.fromEntries(cards);

let rank = 0;
for (const [_, list] of strGroups) {
    const sortedCards = list.sort((a,b) =>  sortReplacer(a).localeCompare(sortReplacer(b)));
    
    for (const card of sortedCards) {
        rank++;
        console.log({card, str: strength[card], rank, bid: bids[card]})
        ranks[card] = Number(bids[card]) * rank;
    }
}

console.log({tot:sum(Object.values(ranks))});
// { tot: 250825971 }