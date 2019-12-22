const Moves = {
    'deal into new stack': (position, size) => (size - position - 1) % size,
    'deal with increment': (position, size, increment) => (position * increment) % size,
    'cut': (pos, size, n) => (size + pos - n) % size,
}

const parseMove = (move, match = move.match(/^(.*?)(-?\d+|)$/)) => ({ name: match[1].trim(), param: +match[2] });
const runMove = (position, move, size) => Moves[move.name](position, size, move.param)
const positionAfterMove = size => (position, moveStr) => runMove(position, parseMove(moveStr), size)

const positionAfterMoves = (position, moves, size) => moves.split('\n').reduce(positionAfterMove(size), position);

let test = `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`;
console.log(positionAfterMoves(0, test, 10), 7)
console.log(positionAfterMoves(9, test, 10), 0)
console.log(positionAfterMoves(8, test, 10), 3)

test = `cut -9531
deal into new stack
deal with increment 38
cut -8776
deal with increment 18
cut 1410
deal with increment 72
deal into new stack
deal with increment 22
cut -8727
deal into new stack
deal with increment 41
deal into new stack
cut 1001
deal with increment 73
cut -9231
deal with increment 16
cut 8964
deal with increment 12
deal into new stack
deal with increment 28
cut 3730
deal with increment 39
deal into new stack
deal with increment 13
cut 6377
deal with increment 40
cut 8162
deal with increment 68
deal into new stack
cut 7163
deal with increment 56
cut -6800
deal with increment 66
deal into new stack
deal with increment 72
cut 3762
deal with increment 14
deal into new stack
deal with increment 48
cut 7812
deal with increment 29
cut -9781
deal with increment 22
cut -5551
deal into new stack
deal with increment 64
cut -8973
deal with increment 55
cut 8183
deal with increment 36
cut -1453
deal with increment 42
cut -5588
deal with increment 48
deal into new stack
cut -1212
deal with increment 5
cut -1798
deal into new stack
cut 6711
deal with increment 23
cut 4919
deal into new stack
deal with increment 32
cut -1690
deal with increment 51
cut 2250
deal into new stack
deal with increment 60
cut -5228
deal with increment 66
cut 2546
deal with increment 27
deal into new stack
cut 4013
deal into new stack
cut -2059
deal with increment 11
cut 7778
deal with increment 46
deal into new stack
cut 5107
deal with increment 10
cut 8038
deal with increment 71
cut 5993
deal with increment 26
cut -3533
deal with increment 53
cut 7258
deal into new stack
cut -8491
deal with increment 60
deal into new stack
deal with increment 36
deal into new stack
cut 6760
deal with increment 51
cut -302`;

console.log(positionAfterMoves(2019, test, 10007), 6638)
