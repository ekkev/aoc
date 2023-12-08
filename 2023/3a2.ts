import { sum } from "./lib/array.ts";
import { matrixFindElements, matrixFindHorizontalPatterns, matrixFromFile } from "./lib/matrix.ts";

const matrix = matrixFromFile('3.in');
const isSymbol = (v: string) => v !== '.' && isNaN(Number(v))

const allNumbers = matrixFindHorizontalPatterns(matrix, {
    regex: /\d+/
});

const numbersWithSymbols = allNumbers.map(([[x, y], num]) =>  
    matrixFindElements(matrix, {
        predicate: isSymbol,
        bbox: [[x-1, y-1], [x + num.length, y+1]],
    }).length > 0 ? Number(num) : 0);

console.log({result: sum(numbersWithSymbols)}) // 522726