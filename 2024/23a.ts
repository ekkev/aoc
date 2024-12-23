import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const pairSet = new Set(File.lines('23.in'));
const pairs = Array.from(pairSet).map(l => l.split('-'));
const arePaired = (two: string[]) => pairSet.has(two.join('-')) || pairSet.has(two.toReversed().join('-'));

const res = pairs.flatMap((pairA, i) =>
    pairs.slice(i+1).map(pairB => [...pairA, ...pairB])
                    .map(nodes =>
                        nodes.some(node => node.startsWith('t'))
                        && nodes.countDistinct() === 3
                        && arePaired(nodes.filter(node => nodes.count(node) === 1))
                        && nodes.distinctValues().sort().join()
)).filter(v => v).countDistinct();

console.log({ res }); // 1240