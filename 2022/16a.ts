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


    // optimal path between valveNodes with cost function of..
    console.log(valveNodes.filter(v=>v).reduce((sum, v, index) => sum + v.rate * (30 - 2 * (index + 1)), 0))

    type QI = { node: string, cost: number, timeremaining: number, opened: string[], cumulativerate: number };
    const queue: QI[] = [{ node: 'AA', cost: 0, timeremaining: 30, opened: [], cumulativerate: 0 }];
    const addToPriorityQueue = (qi: QI) => {
        const pos = queue.findIndex(item => item.cost > qi.cost);
        queue.splice(pos === -1 ? queue.length : pos, 0, qi);
    }

    let el: QI | undefined;
    let foundPaths: QI[] = [];
    let bestFound: QI|undefined;

    let visited: string[] = [];
    while (el = queue.shift()) {
        visited.push(el.node);

        if (el.timeremaining <= 0 || el.opened.length === valveNodes.length) {
            // console.log('End of path', el);
            if (!bestFound) { 
                bestFound = el;
            } else if (bestFound.cumulativerate < el.cumulativerate) {
                bestFound = el;
            }
            // console.log(el);
            // foundPaths.push(el);
            continue; // keep finding other paths
        }

        for (const target of valveNodes) {
            if (el.opened.includes(target.name)) {
                continue;
            }

            const timeremaining = ((el.timeremaining - 1 - (distances.get(key(el.node, target.name))??Infinity)));
            const additionalrate = target.rate * timeremaining;
            const cumulativerate = el.cumulativerate + Math.max(0, additionalrate);
            const opened = [...el.opened, target.name];
            const bestCaseRate = cumulativerate + additionalrate +
                                valveNodes.filter(n => !opened.includes(n.name))
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

    // const max = Math.max.apply(null, foundPaths.map(p => p.cumulativerate))
    // const res = foundPaths.find(p => p.cumulativerate === max)
    // console.log(res, max)
    // console.log(foundPaths.length);
    console.log(bestFound);
}

solve(); // 1673