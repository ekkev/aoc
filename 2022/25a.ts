import { readFileSync } from "node:fs";

const map: Record<string, number> = {
    '2': 2,
    '1': 1,
    '0': 0,
    '-': -1,
    '=': -2,
}

const dectosnafu = (dec: number) => {
    const digits = [];
    let pow = 0;
    while (dec > 0) {
        const p5 = 5**pow;
        const mod5 = (dec/p5) % 5;
        dec -= mod5 * p5;
        if (mod5 >= 3) {
            digits.unshift(mod5 - 5);
            dec += 5 * p5;
        } else {
            digits.unshift(mod5);
        }
        pow++;
    }
    return digits.map(v => v === -2 ? '=' : v === -1 ? '-' : v).join('');
}

const snafutodec = (snafu: string): number => {
    let pow = snafu.length - 1;
    let sum = 0;
    for (const l of snafu) {
        sum += (() => l === '=' ? -2 : l === '-' ? -1 : Number(l))() * 5**pow;
        pow--;
    }
    return sum;
}


console.log(dectosnafu(976), '2=-01')
console.log(snafutodec('2=-01'), 976)
console.log(snafutodec('1121-1110-1=0'), 314159265)
console.log(snafutodec('1=-0-2'), 1747)

const sum = readFileSync('25.in', 'ascii').split(/\n/).map(snafutodec).reduce((sum, v) => sum + v, 0);
console.log(sum, ':' , dectosnafu(sum));