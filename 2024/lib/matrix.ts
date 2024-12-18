import { inRange } from "./array.ts";
import { readAllLines } from "./file.ts";

export type M<T = string> = T[][];
export type XY = [number, number];
export type XYZ = [number, number, number];
export type BBox = [XY, XY];
export type DirStr = "r" | "l" | "u" | "d";

export const X = 0;
export const Y = 1;

export const matrixUp = ([x, y]: XY = [0, 0]): XY => [x, y - 1];
export const matrixDown = ([x, y]: XY = [0, 0]): XY => [x, y + 1];
export const matrixLeft = ([x, y]: XY = [0, 0]): XY => [x - 1, y];
export const matrixRight = ([x, y]: XY = [0, 0]): XY => [x + 1, y];

export const xydirections = (pos: XY = [0, 0]): [XY, XY, XY, XY] => [
  matrixUp(pos),
  matrixDown(pos),
  matrixLeft(pos),
  matrixRight(pos),
];
export const xymove = (pos: XY, dir: DirStr | string) => {
  switch (dir) {
    case "r":
    case ">":
      return matrixRight(pos);
    case "l":
    case "<":
      return matrixLeft(pos);
    case "u":
    case "^":
      return matrixUp(pos);
    case "d":
    case "v":
      return matrixDown(pos);
  }
  throw new Error(`Unknown direction ${dir}`);
};

export const xydirturn = (dir: DirStr, turn: "l" | "r"): DirStr =>
  ({
    "rr": "d",
    "rl": "u",
    "lr": "u",
    "ll": "d",
    "ur": "r",
    "ul": "l",
    "dr": "l",
    "dl": "r",
  })[[dir, turn].join("")] as DirStr;

export const xykey = ([x, y]: XY) => `${x},${y}`;
export const xyequal = ([x1, y1]: XY, [x2, y2]: XY): boolean =>
  x1 === x2 && y1 === y2;
export const xyadd = ([x1, y1]: XY, [x2, y2]: XY): XY => [x1 + x2, y1 + y2];
export const xysub = ([x1, y1]: XY, [x2, y2]: XY): XY => [x1 - x2, y1 - y2];
export const xymulN = ([x1, y1]: XY, n: number): XY => [n * x1, n * y1];

export const matrixFromLines = (lines: string[]): M =>
  lines.map((line) => line.split(""));
export const matrixFromString = (lines: string): M =>
  lines.split(/\n/).map((line) => line.split(""));
export const matrixFromFile = (file: string) =>
  matrixFromLines(readAllLines(file));

export const matrixCreate = (width: number, height: number, gen = () => ".") =>
  Array.from({ length: height }, () => Array.from({ length: width }, gen));

export const matrixGet = <T = string>(
  matrix: M<T>,
  [x, y]: XY,
): T | undefined => matrix[y] ? matrix[y][x] as T : undefined;
export const matrixSet = <T = string>(matrix: M<T>, [x, y]: XY, v: T) => {
  if (matrix[y]) {
    const oldvalue = matrix[y][x];
    matrix[y][x] = v;
    return oldvalue;
  }
  throw new Error(`No row ${y} in matrix`);
};

export const matrixSetter = <T = string>(matrix: M<T>, v: T) => (pos: XY) => matrixSet(matrix, pos, v);

export const matrixSetIfInside = <T = string>(matrix: M<T>, pos: XY, v: T) => {
  if (inMatrix(matrix, pos)) {
    matrixSet(matrix, pos, v);
    return true;
  }

  return false;
}

export const matrixForEachRow = (matrix: M, cb: (y: number) => unknown) =>
  matrix.forEach((_row, y) => cb(y));
export const matrixForEachCol = (matrix: M, cb: (x: number) => unknown) =>
  matrix[0].forEach((_el, x) => cb(x));

export const matrixRows = <T = string>(
  matrix: M<T>,
  start: number,
  end: number,
) => [...matrix].slice(Math.max(0, start), end + 1);
export const matrixCols = <T = string>(
  matrix: M<T>,
  start = 0,
  end = Infinity,
) => matrix.map((row) => row.slice(Math.max(0, start), end + 1));

export const matrixMaxX = (matrix: M) => matrix[0].length - 1;
export const matrixMaxY = (matrix: M) => matrix.length - 1;
export const matrixWidth = (matrix: M) => matrix[0].length;
export const matrixHeight = (matrix: M) => matrix.length;

export const matrixSlice = <T = string>(
  matrix: M<T>,
  [[x1, y1], [x2, y2]]: BBox,
) => matrixCols(matrixRows(matrix, y1, y2), x1, x2);

export const matrixClone = (
  matrix: M,
): M => [...matrix.map((line) => [...line])];

export const matrixEquals = (a: M, b: M) =>
  a.length === b.length && matrixToString(a) === matrixToString(b);

export const matrixToString = (matrix: M): string =>
  matrix.map((line) => line.join("")).join("\n");
export const matrixPrint = (
  matrix: M,
  opts: { bbox?: BBox; replacer?: (v: string) => string } = {},
) =>
  (opts.bbox ? matrixSlice(matrix, opts.bbox) : matrix)
    .forEach((line) =>
      console.log(line.map(opts.replacer ?? ((v) => v)).join(""))
    );

export const matrixFindElements = <T = string>(
  matrix: M<T>,
  opts:
    & (
      | {
        value: T;
      }
      | {
        predicate: (v: T, xy: XY) => boolean;
      }
    )
    & {
      map?: <T>(v: T, xy: XY) => T;
      bbox?: BBox;
    },
): [XY, T][] => {
  const res: [XY, T][] = [];
  let m = matrix, offsetX = 0, offsetY = 0;
  if (opts.bbox) {
    m = matrixSlice(matrix, opts.bbox);
    offsetX = Math.max(0, opts.bbox[0][0]);
    offsetY = Math.max(0, opts.bbox[0][1]);
  }
  m.forEach((row, y) => {
    row.forEach((v, x) => {
      if (
        ("value" in opts && v === opts.value) ||
        ("predicate" in opts && opts.predicate(v, [x, y]))
      ) {
        res.push([
          [offsetX + x, offsetY + y],
          opts.map ? opts.map(v, [x, y]) : v,
        ]);
      }
    });
  });
  return res;
};

export const matrixFindHorizontalPatterns = <T = string>(matrix: M, opts: {
  regex: RegExp | string;
  map?: (v: string, xy: XY) => T;
}): [XY, T][] => {
  const res: [XY, T][] = [];
  const re = new RegExp(opts.regex, "g");

  for (const [y, line] of matrix.entries()) {
    const matches = line.join("").matchAll(re);
    for (const m of matches) {
      const x = m.index!;
      const v = opts.map ? opts.map(m[0], [x, y]) : m[0];
      res.push([[x, y], v as T]);
    }
  }

  return res;
};

/**
 * Rotates matrix 90 degress clockwise / to-the-right
 * Nice property: earlier #rows from start ==> #columns from start
 * @param matrix
 * @returns
 */
export const rotateMatrix = (matrix: M): M => {
  const rotatedMatrix = Array.from(
    { length: matrix[0].length },
    () => new Array(matrix.length),
  );
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      rotatedMatrix[j][matrix.length - 1 - i] = matrix[i][j];
    }
  }

  return rotatedMatrix;
};

/**
 * Transpose - flip over diagonal. Swap rows and columns.
 * @param matrix
 * @returns Matrix
 */
export const transposeMatrix = <TVal = string>(matrix: M<TVal>): M<TVal> => {
  const rotatedMatrix = Array.from(
    { length: matrix[0].length },
    () => new Array(matrix.length),
  );
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      rotatedMatrix[j][i] = matrix[i][j];
    }
  }

  return rotatedMatrix;
};

export const matrixFindVerticalPatterns = <T = string>(matrix: M, opts: {
  regex: RegExp;
  map?: (v: string, xy: XY) => T;
}): [XY, T][] => {
  const res: [XY, T][] = [];

  for (const [x, line] of transposeMatrix(matrix).entries()) {
    const matches = line.join("").matchAll(opts.regex);
    for (const m of matches) {
      const y = m.index!;
      const v = opts.map ? opts.map(m[0], [x, y]) : m[0];
      res.push([[x, y], v as T]);
    }
  }

  return res;
};

export const matrixFindDiagonalPatterns = <T = string>(matrix: M, opts: {
  regex: RegExp;
  map?: (v: string, xy: XY) => T;
}): [XY, T][] => {
  const res: [XY, T][] = [];

  // Create diagonal lines in both ways to search from
  const lines: string[] = [];

  matrixForEachRow(matrix, (y) => {
    if (y === 0) {
      matrix[y].forEach((_, x) => {
        let pos: XY = [x, y];
        let s = matrixGet(matrix, pos) ?? "";
        while (inMatrix(matrix, xyadd(pos, [1, 1]))) {
          pos = xyadd(pos, [1, 1]);
          s += matrixGet(matrix, pos) ?? "";
        }
        lines.push(s);
      });
    } else if (y === matrix.length - 1) {
      matrix[y].forEach((_, x) => {
        let pos: XY = [x, y];
        let s = matrixGet(matrix, pos) ?? "";
        while (inMatrix(matrix, xyadd(pos, [1, -1]))) {
          pos = xyadd(pos, [1, -1]);
          s += matrixGet(matrix, pos) ?? "";
        }
        lines.push(s);
      });
    } else {
      let pos: XY = [0, y];
      let s = matrixGet(matrix, pos) ?? "";
      while (inMatrix(matrix, xyadd(pos, [1, 1]))) {
        pos = xyadd(pos, [1, 1]);
        s += matrixGet(matrix, pos) ?? "";
      }

      lines.push(s);

      pos = [0, y];
      s = matrixGet(matrix, pos) ?? "";
      while (inMatrix(matrix, xyadd(pos, [1, -1]))) {
        pos = xyadd(pos, [1, -1]);
        s += matrixGet(matrix, pos) ?? "";
      }
      lines.push(s);
    }
  });

  for (const line of lines) {
    const matches = line.matchAll(opts.regex);
    for (const m of matches) {
      const v = m[0];
      res.push([[0, 0], v as T]);
    }
  }

  return res;
};

export const inBbox = (pos: XY, a: XY, b: XY) =>
  inRange(pos[0], a[0], b[0]) && inRange(pos[1], a[1], b[1]);
export const inMatrix = <T = string>(matrix: M<T>, [x, y]: XY) =>
  x < matrix[0].length && x >= 0 && y >= 0 && y < matrix.length;
