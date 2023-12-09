import { lineByLine } from "./file.ts";
import { sum } from "./lib/array.ts";
import { findPathsFlexi } from "./lib/path.ts";

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
        const res = findPathsFlexi<string>({
            startNodes: [from],
            endCondition: el => el === to,
            nextMovesFn: el => nodes[el].targets,
            cacheKeyFn: el => el,
        }).next();
        distances.set(key(from, to), res.value.finalCost);
    }

    // Map distances between valves with flow rate
    const valveNodes = Object.values(nodes).filter(v => v.rate).sort((a, b) => b.rate-a.rate);
    valveNodes.forEach((outer, index) => {
        distanceBetween(outer.name, 'AA')
        valveNodes.filter((_, innerIndex) => innerIndex > index).forEach(inner => {
            distanceBetween(outer.name, inner.name);
        })
    });

    type QI = { node: string,  timeremaining: number, closed: ValveNode[], cumulativerate: number };
    let bestFound: QI|undefined = undefined;

    const itFinder = findPathsFlexi<QI>({
        startNodes: [{ node: 'AA', timeremaining: 30, closed: valveNodes.filter(v => v.name !== 'AA'), cumulativerate: 0 }],
        endCondition: (el) => el.timeremaining <= 0 || el.closed.length === 0,
        nextMovesFn: (el) => el.closed.map(target => {
            const timeremaining = el.timeremaining - 1 - (distances.get(key(el.node, target.name))!);
            const cumulativerate = el.cumulativerate + Math.max(0,  target.rate * timeremaining);
            const closed = el.closed.filter(v => v.name !== target.name);
            const bestCaseRate = cumulativerate +
                                sum(closed.map((v, index) => Math.max(0, v.rate * (timeremaining - 2 * (index + 1)))));

            if (bestFound && bestCaseRate <= bestFound.cumulativerate) {
                return;
            }

            return {
                node: target.name, 
                closed,
                timeremaining,
                cumulativerate,
            }
        }).filter(v => v !== undefined) as QI[],
        costFn: el => -el.cumulativerate, // Look at highest cumulative rate first, tiny speedup
    })

    for (const el of itFinder) {
        if (!bestFound) { 
            bestFound = el.finalElement;
        } else if (bestFound.cumulativerate < el.finalElement.cumulativerate) {
            bestFound = el.finalElement;
        }        
    }

    console.log({bestFound, res: bestFound?.cumulativerate});
}

solve(); // 1741