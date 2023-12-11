
export const betweenExcluding = (v: number, a: number, b: number) => v > Math.min(a, b) && v < Math.max(a, b);


/**
 * Suurim ühistegur = greatest common divisor
 */
export const gcd = (a: number, b: number): number => {
    // Until nothing left over from division between the number
    while (b != 0) {
        [b, a] = [a % b, b];
    }
    return a;
}

/**
 * Vähim ühiskordaja = least common multiple
 */
export const lcm = (a: number, b: number): number => {
    return a * b / gcd(a, b);
}