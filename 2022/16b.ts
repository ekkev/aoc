import { time } from "console";
import { lineByLine } from "./file";
import { range } from "./lib/array";

async function solve() {


    type ValveNode = {
        name: string,
        rate: number,
        targets: string[],
    };
    const nodes: Record<string, ValveNode> = {};
    const paths: Set<[string, string]> = new Set;

    const sorted = (pair: [string, string]): [string, string] => pair.sort();
    const key = (...pair: string[]): string => pair.sort().join(':');

    for await  (const line of await lineByLine('16.in')) {
        const m = line.match(/Valve (?<valve>..) has flow rate=(?<rate>\d+); tunnels* leads* to valves* (?<targets>.*)$/);
        if (!m || !m?.groups?.valve) {
            throw new Error('parse')
        }
        const node: ValveNode = {
            name: m.groups.valve,
            rate: parseInt(m.groups.rate, 10),
            targets: m.groups.targets.split(', ')
        }
        nodes[node.name] = node;
        node.targets.forEach(to => paths.add(sorted([node.name, to]) as [string, string]));

    }

    const distances: Map<string, number> = new Map;
    const distanceBetween = (from: string, to: string) => {
        if (distances.has(key(from, to))) {
            return distances.get(key(from, to));
        }

        type QI = { node: string, cost: number };
        const queue: QI[] = [{ node: from, cost: 0 }];
        const addToPriorityQueue = (qi: QI) => {
            const pos = queue.findIndex(item => item.cost > qi.cost);
            queue.splice(pos === -1 ? queue.length : pos, 0, qi);
        }

        let el: QI | undefined;

        let visited: string[] = [];

        while (el = queue.shift()) {
            visited.push(el.node);

            if (el.node === to) {
                // console.log('Distance', from, to, el.cost);
                distances.set(key(from, to), el.cost);
                return el.cost;
            }

            for (const target of nodes[el.node].targets) {
                if (visited.includes(target)) {
                    continue;
                }
                addToPriorityQueue({ node: target, cost: el.cost + 1})
            }
        }
    }

    // Map distances between valves with flow rate
    const valveDistances: [string, string, number][] = []; // valve nodes
    const valveNodes = Object.values(nodes).filter(v => v.rate).sort((a, b) => b.rate-a.rate);

    valveNodes.forEach((outer, index) => distanceBetween(outer.name, 'AA') && valveNodes.filter((_, innerIndex) => innerIndex > index).forEach(inner => {
        distanceBetween(outer.name, inner.name);
    }));

    // Two paths in parallel. Find all paths for A, then best paths for each for B, and optimize for sum of best?
    const TIME_TOTAL = 26; // minutes

    type QI = { node: string, cost: number, timeremaining: number, opened: string[], cumulativerate: number };

    const findAllPaths = (openedBefore: string[]) => {

        const queue: QI[] = [{ node: 'AA', cost: 0, timeremaining: TIME_TOTAL, opened: [], cumulativerate: 0 }];
        const addToPriorityQueue = (qi: QI) => {
            const pos = queue.findIndex(item => item.cost > qi.cost);
            queue.splice(pos === -1 ? queue.length : pos, 0, qi);
        }

        let el: QI | undefined;
        let foundPaths: QI[] = [];
        let bestFound: QI|undefined;

        while (el = queue.shift()) {

            // Change here -- stop after 1/2 of valves opened (or all across both players)
            if (el.timeremaining <= 0 || el.opened.length >= valveNodes.length/2 || (el.opened.length + openedBefore.length) === valveNodes.length) {
                if (!bestFound) { 
                    bestFound = el;
                } else if (bestFound.cumulativerate < el.cumulativerate) {
                    bestFound = el;
                }
                foundPaths.push(el);
                continue; // keep finding other paths
            }

            for (const target of valveNodes) {
                if (el.opened.includes(target.name) || openedBefore.includes(target.name)) {
                    continue;
                }

                const timeremaining = ((el.timeremaining - 1 - (distances.get(key(el.node, target.name))??Infinity)));
                const additionalrate = target.rate * timeremaining;
                const cumulativerate = el.cumulativerate + Math.max(0, additionalrate);
                const opened = [...el.opened, target.name];
                const bestCaseRate = cumulativerate + additionalrate +
                                    valveNodes.filter(n => ![...opened, ...openedBefore].includes(n.name))
                                            .reduce((sum, v, index) => sum + v.rate * (timeremaining - 2 * (index + 1)), 0);
                if (bestFound && bestCaseRate < bestFound.cumulativerate) {
                    continue;
                }

                addToPriorityQueue({
                    node: target.name, 
                    cost: -bestCaseRate, 
                    opened, 
                    timeremaining,
                    cumulativerate,
                })
            }
        }

        return foundPaths;
    }

    const playerOnePaths = findAllPaths([]);

    
    const bothPlayerMax = playerOnePaths.map((path, index) => {
        if (!(index % 100))
            console.log(index, ' of ', playerOnePaths.length);
        const playerTwoPaths = findAllPaths(path.opened);
        const max = Math.max.apply(null, playerTwoPaths.map(p => p.cumulativerate))
        return path.cumulativerate + max;
    })

    const max = Math.max.apply(null, bothPlayerMax)
    console.log(max)
}

solve(); // 2min, 2343