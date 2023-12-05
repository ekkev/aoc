import { inRange } from "./array.ts";
import { readAllLines } from "./file.ts";

export type M = string[][];
export type XY = [number, number];
export type BBox = [XY, XY];

export const xykey = ([x, y]: XY) => `${x},${y}`;
export const matrixFromLines = (lines: string[]): M => lines.map(line => line.split(''));
export const matrixFromFile = (file: string) => matrixFromLines(readAllLines(file));
export const matrixGet = (matrix: M, [x, y]: XY): string | undefined => matrix[y] ? matrix[y][x] : undefined;
export const matrixSet = (matrix: M, [x, y]: XY, v: string) => { if (matrix[y]) { matrix[y][x] = v; return; } throw new Error(`No row ${y} in matrix`) };
export const matrixRows = (matrix: M, start: number, end: number) => [...matrix].slice(Math.max(0, start), end + 1);
export const matrixCols = (matrix: M, start = 0, end = Infinity) => matrix.map(row => row.slice(Math.max(0, start), end + 1));
export const matrixSlice = (matrix: M, [[x1, y1], [x2, y2]]: BBox) => matrixCols(matrixRows(matrix, y1, y2), x1, x2);
export const matrixPrint = (matrix: M, opts: { bbox?: BBox, replacer?: (v: string) => string } = {}) => 
    (opts.bbox ? matrixSlice(matrix, opts.bbox) : matrix)
    .forEach(line => console.log(line.map(opts.replacer ?? (v => v)).join('')));

export const matrixFindElements = (matrix: M, opts: {
    predicate: (v: string, xy: XY) => boolean,
    map?: (v: string, xy: XY) => string,
    bbox?: BBox
}): [XY, string][] => {
    const res: [XY, string][] = [];
    let m = matrix, offsetX = 0, offsetY = 0;
    if (opts.bbox) {
        m = matrixSlice(matrix, opts.bbox);
        offsetX = Math.max(0, opts.bbox[0][0]);
        offsetY = Math.max(0, opts.bbox[0][1]);
    }
    m.forEach((row, y) => {
        row.forEach((v, x) => {
            if (opts.predicate(v, [x, y])) {
                res.push([[offsetX+x, offsetY+y], opts.map ? opts.map(v, [x, y]) : v])
            }
        })
    });
    return res;
};

export const matrixFindHorizontalPatterns = <T = string>(matrix: M, opts: {
    regex: RegExp,
    map?: (v: string, xy: XY) => T
}): [XY, T][] => {
    const res: [XY, T][] = [];

    for (const [y, line] of matrix.entries()) {
        const matches = line.join('').matchAll(opts.regex);
        for (const m of matches) {
            const x = m.index!;
            const v = opts.map ? opts.map(m[0], [x, y]) : m[0];
            res.push([[x, y], v as T]);
        }
    }

    return res;
}

export const rotateMatrix = (matrix: M): M => {
    const n = matrix.length;
    const rotatedMatrix = Array.from({length: matrix[0].length}, () => new Array(n));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            rotatedMatrix[j][n - 1 - i] = matrix[i][j];
        }
    }

    return rotatedMatrix;
}

export const matrixFindVerticalPatterns = <T = string>(matrix: M, opts: {
    regex: RegExp,
    map?: (v: string, xy: XY) => T
}): [XY, T][] => {
    const res: [XY, T][] = [];

    for (const [x, line] of rotateMatrix(matrix).entries()) {
        console.log(line.join(''));
        const matches = line.join('').matchAll(opts.regex);
        for (const m of matches) {
            const y = m.index!;
            const v = opts.map ? opts.map(m[0], [x, y]) : m[0];
            res.push([[x, y], v as T]);
        }
    }

    return res;
}

export const inBbox = (pos: XY, a: XY, b: XY) =>  inRange(pos[0], a[0], b[0]) && inRange(pos[1], a[1], b[1])
