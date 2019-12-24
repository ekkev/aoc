const BOARDSIZE = 25;
const ROWSIZE = 5;

const allOnes = 0b1111111111111111111111111;
const noRightEdges = 0b1111011110111101111011110;
const noLeftEdges = noRightEdges >> 1;

const or = (...boards) =>
    boards.reduce((a, b) => a | b, 0)

const none = (...boards) =>
    allOnes ^ or(...boards)

const exactlyOne = (a, b, c, d = 0) =>
      a & none(b, c, d)
    | b & none(a, c, d)
    | c & none(a, b, d)
    | d & none(a, b, c)

const exactlyTwo = (a, b, c, d) =>
      a & exactlyOne(b, c, d)
    | b & exactlyOne(a, c, d)
    | c & exactlyOne(a, b, d)
    | d & exactlyOne(a, b, c)


const iterateBugs = board => {
    const neighbours = [board << 1 & noRightEdges,
                        board << ROWSIZE,
                        board >> 1 & noLeftEdges,
                        board >> ROWSIZE];

    const exactlyOneNeighbour = exactlyOne(...neighbours);

    const keepers =  board & exactlyOneNeighbour;
    const noobs   = ~board & (exactlyOneNeighbour | exactlyTwo(...neighbours));

    return keepers | noobs;
}

const inputMap = ({ '#': '1', '.': 0, '\n': '' })
const parseInput = text =>
    parseInt(text.split('').reverse().map(v => inputMap[v]).join(''), 2)

const dbg = board =>
    '\n' + board.toString(2).padStart(BOARDSIZE, '0').split('').reverse().join('').split(/(.{5})/).filter(v => v).join('\n');

const solve = text => {
    let board = parseInput(text);
    const seen = new Set();

    while (!seen.has(board)) {
        seen.add(board);
        board = iterateBugs(board)
    }

    return board;
}

let test = `....#
#..#.
#..##
..#..
#....`;
console.log(solve(test), 2129920);


test = `..#..
##..#
##...
#####
.#.##`;
console.log(solve(test), 2130474);
