import { fileAsTuples } from "./lib/file.ts";

const input = fileAsTuples('25.in');

const edges = [];
const nodes = new Set<string>();

for (const [fromorig, ...too] of input) {
    const from = fromorig.substring(0, fromorig.length-1)
    nodes.add(from);
    for (const to of too) {
        nodes.add(to);
        edges.push([from, to].sort((a, b) => a.localeCompare(b)))
    }
}

// Sequential numeric id for each node
const seqid = Object.fromEntries([...nodes].map((name, i) => [name, i]))
const length = nodes.size;

// Build adjacency map
const adjmap: number[][] = Array.from({ length }, () => Array.from({ length }, () => 0));
for (const [from, to] of edges) {
    adjmap[seqid[from]][seqid[to]] = 1;
    adjmap[seqid[to]][seqid[from]] = 1;
}

// Simplified Stoer–Wagner algorithm for cut of exact size
// (original solution was staring-at-dotout-with-svg-editor-kind..)
const groupings = Array.from({ length: length }, (_, i) => [i]);
let t = 0;
let max = length;
while (max --> 0) {
    const weights = [...adjmap[0]];
    let s = 0;
    t = 0;
    let loops = max;
    while (loops --> 0) {
        weights[t] = -Infinity;
        s = t;
        t = weights.indexOf(Math.max(...weights));
        weights.forEach((w, i) => {
            weights[i] = w + adjmap[t][i];
        });
    }

    // Look for cut size of exactly 3
    if (weights[t] - adjmap[t][t] === 3) {
        break;
    }

    // merge t into s
    groupings[s].push(...groupings[t]);
    for (let i = 0; i < length; i++) {
        adjmap[i][s] = adjmap[s][i] += adjmap[t][i];
    }

    // Remove weight for future rounds
    adjmap[0][t] = -Infinity;
}

const groupA = groupings[t].length;
const groupB = nodes.size - groupA;
console.log({ groupA, groupB, res: groupA*groupB});
// { groupA: 776, groupB: 703, res: 545528 }