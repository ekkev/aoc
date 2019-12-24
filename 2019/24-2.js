const BOARDSIZE = 25;
const ROWSIZE = 5;

const allOnes      = 0b1111111111111111111111111;
const rightEdges   = 0b0000100001000010000100001;
const leftEdges    = 0b1000010000100001000010000;
const topEdges     = 0b1111100000000000000000000;
const bottomEdges  = 0b0000000000000000000011111;
const middleTile   = 0b0000000000001000000000000;

const or = (boards, skip) =>
    boards.reduce((a, value, i) => skip === i ? a : a | value, 0)

const none = (boards, skip) =>
    allOnes ^ or(boards, skip)

const cut = (arr, i) =>
    arr.filter((v, index) => index !== i)

const exactlyOne = boards =>
    allOnes & boards.reduce((res, board, i) => res | board & none(boards, i), 0)

const exactlyTwo = boards =>
    allOnes & boards.reduce((res, board, i) => res | board & exactlyOne(cut(boards, i)), 0)

const outerNeighbours = outerBoard =>
    // All right edges have neighbor from outer pos 11, etc
    [ outerBoard & (1 << 13) ? leftEdges : 0,
      outerBoard & (1 << 11) ? rightEdges : 0,
      outerBoard & (1 << 17) ? topEdges : 0,
      outerBoard & (1 << 7)  ? bottomEdges : 0
    ].filter(v => v)

const pick = (board, pos, target) =>
    (board >> pos & 1) << target

const innerNeighbours = board =>
    [ pick(board, 0, 7), pick(board, 1, 7), pick(board, 2, 7), pick(board, 3, 7), pick(board, 4, 7),
      pick(board, 20, 17), pick(board, 21, 17), pick(board, 22, 17), pick(board, 23, 17), pick(board, 24, 17),
      pick(board, 0, 11), pick(board, 5, 11), pick(board, 10, 11), pick(board, 15, 11), pick(board, 20, 11),
      pick(board, 4, 13), pick(board, 9, 13), pick(board, 14, 13), pick(board, 19, 13), pick(board, 24, 13)
    ].filter(v => v)

const iterateBugs = (board, outerBoard, innerBoard) => {
    const neighbours = [board << 1 & ~rightEdges,
                        board << ROWSIZE,
                        board >> 1 & ~leftEdges,
                        board >> ROWSIZE,
                        ...outerNeighbours(outerBoard),
                        ...innerNeighbours(innerBoard)]

    const exactlyOneNeighbour = exactlyOne(neighbours)

    const keepers =  board & exactlyOneNeighbour
    const noobs   = ~board & (exactlyOneNeighbour | exactlyTwo(neighbours))

    return ~middleTile & (keepers | noobs)
}

const iterateBoards = boards => {
    if (boards.get(Math.max(...boards.keys())))
        boards.set(Math.max(...boards.keys()) + 1, 0)
    if (boards.get(Math.min(...boards.keys())))
        boards.set(Math.min(...boards.keys()) - 1, 0)

    const getBoard = level => boards.get(level) || 0
    const newBoards = new Map

    boards.forEach((board, level) =>
        newBoards.set(level, iterateBugs(board, getBoard(level-1), getBoard(level+1))))
    return newBoards
}

const inputMap = ({ '#': 1, '.': 0, '\n': '' })
const parseInput = text =>
    parseInt(text.split('').reverse().map(v => inputMap[v]).join(''), 2)

const bugsOnBoard = board =>
    board.toString(2).split('').filter(v => v === '1').length

const bugCount = boards =>
    [...boards.values()].reduce((sum, board) => sum + bugsOnBoard(board), 0)

const solve = (text, minutes) => {
    let boards = new Map([[0, parseInput(text)]])

    while (minutes --> 0)
        boards = iterateBoards(boards)

    return bugCount(boards)
}

let test = `....#
#..#.
#..##
..#..
#....`;
console.log(solve(test, 10), 99);


test = `..#..
##..#
##...
#####
.#.##`;
console.log(solve(test, 200), 1923);
