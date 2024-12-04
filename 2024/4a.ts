import { File, globalProtos } from "./lib/index.ts";
import { matrixFindDiagonalPatterns } from "./lib/matrix.ts";
import { matrixFindVerticalPatterns } from "./lib/matrix.ts";
import { matrixFindHorizontalPatterns } from "./lib/matrix.ts";
globalProtos();

const matrix = File.charMatrix('4.in');

let res = 
  matrixFindHorizontalPatterns(matrix, { regex: /XMAS/g }).length
+ matrixFindHorizontalPatterns(matrix, { regex: /SAMX/g }).length
+ matrixFindVerticalPatterns(matrix, { regex: /XMAS/g}).length
+ matrixFindVerticalPatterns(matrix, { regex: /SAMX/g}).length
+ matrixFindDiagonalPatterns(matrix, { regex: /XMAS/g}).length
+ matrixFindDiagonalPatterns(matrix, { regex: /SAMX/g}).length;

console.log({ res });


