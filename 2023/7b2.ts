import { countElementsInGroups, numericDesc, translateMap, translator } from "./lib/array.ts";
import { fileAsTuples } from "./lib/file.ts";
import { protosString } from "./lib/string.ts";
import { protosArray } from "./lib/array.ts";
protosArray(); protosString();

// After submission playground, reddit-inspired optimisation
// Conditions are statisfied by sorting cards by 'count of highest rank + jokers' -> 'count of 2nd highest rank' -> sortable string representation
const sortingTranslator = translator(translateMap('AKQT98765432J', 'edca987654321'))

const top = (card: string) => Object.values(countElementsInGroups(card.replaceAll('J', ''))).sort(numericDesc);

const sortables = fileAsTuples('7.in')
                    .map(([card, bid]) => [
                        [
                            (top(card)[0] ?? 0) + card.count('J'), 
                            (top(card)[1] ?? 0),
                            card.replace(/./g, sortingTranslator)
                        ],
                        Number(bid)
                    ]);

console.log({
    res: sortables.tupleSortByKey().tupleValues<number>().map((bid, i) => bid * (i+1)).sum(),
    expect: 250825971
});
