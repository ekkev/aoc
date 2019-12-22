const BigNumber = require('bignumber.js')

BigNumber.config({
    MODULO_MODE: BigNumber.EUCLID, // Avoid negative modulo
});

// After hours of reversing functions, back to nonreversed direction
const Moves = {
    'deal into new stack': ([mul, add], size) =>
        [mul.times(-1),
         add.times(-1).plus(size).minus(1)],
    'deal with increment': ([mul, add], size, increment) =>
        [mul.times(increment).mod(size),
         add.times(increment).mod(size)],
    'cut': ([mul, add], size, cut) =>
        [mul,
         add.minus(cut)],
}

const parseMove = (move, match = move.match(/^(.*?)(-?\d+|)$/)) => ({ name: match[1].trim(), param: BigNumber(+match[2]) });
const runMove = (ab, move, size) => Moves[move.name](ab, size, move.param)
const positionBeforeMove = size => (ab, moveStr) => runMove(ab, parseMove(moveStr), size)

const cardAtPositionBeforeRepeatedMoves = (position, moves, size, repeat = 1) => {

    let [mul, add] = [BigNumber(1), BigNumber(0)];
    [mul, add] = moves.split('\n').reduce(positionBeforeMove(size), [mul, add]);

    // Math borrowed from reddit and much smarter people...
    // Linear functions add up
    // rep = mul ** repeat % size
    // add = add * rep-1 * mul-1**size-2 % size
    add = add.times( mul.pow(repeat, size).minus(1) )
             .times( mul.minus(1).pow(size.minus(2), size) )
             .mod(size)
    mul = mul.pow(repeat, size);

    // position = x * mul + add
    return position.minus(add).times(mul.pow(size.minus(2), size)).mod(size).toFixed()
}

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

console.log(cardAtPositionBeforeRepeatedMoves(BigNumber(2020), test, BigNumber(119315717514047), BigNumber(101741582076661)), 77863024474406)
