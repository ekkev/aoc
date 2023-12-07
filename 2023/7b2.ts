import { countElementsInGroups, numericDesc, sum, translateMap, translator } from "./lib/array.ts";
import { fileAsTuples } from "./lib/file.ts";
import { countInString } from "./lib/string.ts";
import { tupleSortByKey, tupleValues } from "./lib/tuple.ts";

// After submission playground, reddit-inspired optimisation
// Conditions are statisfied by sorting cards by 'count of highest rank + jokers' -> 'count of 2nd highest rank' -> sortable string representation
const sortingTranslator = translator(translateMap('AKQT98765432J', 'edca987654321'))

const top = (card: string) => Object.values(countElementsInGroups(card.replaceAll('J', '').split(''))).sort(numericDesc);

const sortables: [string, number][] = fileAsTuples('7.in')
                    .map(([card, bid]) =>[
                        [
                            (top(card)[0] ?? 0) + countInString(card, 'J'), 
                            (top(card)[1] ?? 0),
                            card.replace(/./g, sortingTranslator)
                        ].join(),
                        Number(bid)
                    ]);

console.log({
    res: sum(tupleValues(tupleSortByKey(sortables)).map((bid, i) => bid * (i+1))), 
    expect: 250825971
});
