type Grow<T, A extends Array<T>> = 
  ((x: T, ...xs: A) => void) extends ((...a: infer X) => void) ? X : never;
type GrowToSize<T, A extends Array<T>, N extends number> = 
  { 0: A, 1: GrowToSize<T, Grow<T, A>, N> }[A['length'] extends N ? 0 : 1];
export type Tuple<T extends TupleKey = string, N extends number = 2> = GrowToSize<T, [], N>;

export type Pair<A, B> = [A, B];
export type TupleKey = number|string|unknown[];

/**
 * Group list of tuples by key, `[[a, b], [a, c]] => [[a, [b, c]]]`
 * 
 * Useful to reduce next. Also shorthand: tupleReduceInGroups 
 * 
 * @param tuples Key-value pair tuples
 * @returns Key-list of values pair tuples
 */
export const tupleGroupByKey = <K extends TupleKey, V>(tuples: [K, V][]): [string, V[]][] => {
    const res: Map<string, V[]> = new Map;
    tuples.forEach(([k, v]) => res.set(sanitizeKey(k), [...res.get(sanitizeKey(k))??[], v]));
    return [...res.entries()];
}


export const tupleSortByKey = <K extends TupleKey, V>(tuples: [K, V][]) =>
    tuples.sort((a, b) => sanitizeKey(a[0]).localeCompare(sanitizeKey(b[0])))

export const zip = <K extends TupleKey, V>(arr1: K[], arr2: V[]) => arr1.map((k, i) => [k, arr2[i]]);

const sanitizeKey = (key: TupleKey) => {
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
export const tupleGroupsJoin = <K extends TupleKey, V>(a: [K, V[]][], b: [K, V[]][]): [K, V[]][] => {
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
 * @returns Array of tuples of [key, reduced value]
 */
export const tupleReduceInGroups = <K extends TupleKey, V, RV>(tuples: [K, V][], reducer: (current: RV, value: V) => RV, initial: RV): [string, RV][] =>
    tupleGroupByKey(tuples).map(([k, values]) => [k, values.reduce(reducer, initial)]);

export const tupleKeys = <K extends TupleKey, V>(tuples: [K, V][]): K[] => tuples.map(([k, _]) => k);
export const tupleValues = <K extends TupleKey, V>(tuples: [K, V][]): V[] => tuples.map(([_, v]) => v);
