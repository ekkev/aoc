/**
 * Group list of tuples by key, `[[a, b], [a, c]] => [[a, [b, c]]]`
 * 
 * Useful to reduce next. Also shorthand: tupleReduceInGroups 
 * 
 * @param tuples Key-value pair tuples
 * @returns Key-list of values pair tuples
 */
export const tupleGroupByKey = <K, V>(tuples: [K, V][]): [string, V[]][] => {
    const res: Map<string, V[]> = new Map;
    tuples.forEach(([k, v]) => res.set(sanitizeKey(k), [...res.get(sanitizeKey(k))??[], v]));
    return [...res.entries()];
}

const sanitizeKey = (key: any) => {
    if (Array.isArray(key)) {
        return key.join(',');
    }
    return key.toString();
}

/**
 * Join 2 grouped tuples by key, concating value arrays
 * @param a Tuple A
 * @param b Tuple B
 */
export const tupleGroupsJoin = <K, V>(a: [K, V[]][], b: [K, V[]][]): [K, V[]][] => {
    const res = Object.fromEntries(a);
    b.forEach(([k, v]) => {
        res[k] = [...(res[k]??[]), ...v];
    })
    return Object.entries(res) as [K, V[]][];
}

/**
 * 
 * @param tuples 
 * @param reducer 
 * @param initial 
 * @returns 
 */
export const tupleReduceInGroups = <K, V, RV>(tuples: [K, V][], reducer: (current: RV, value: V) => RV, initial: RV): [string, RV][] =>
    tupleGroupByKey(tuples).map(([k, values]) => [k, values.reduce(reducer, initial)]);

export const tupleKeys = <K, V>(tuples: [K, V][]): K[] => tuples.map(([k, _]) => k);
export const tupleValues = <K, V>(tuples: [K, V][]): V[] => tuples.map(([_, v]) => v);
