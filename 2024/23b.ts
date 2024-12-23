import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const pairs = Object.fromEntries(File.lines("23.in").map(l => [l.replace('-',','), l.split('-')]));
const pairsWith = (a: string) => (b: string) => pairs[[a, b].join()] || pairs[[b, a].join()];
const allNodes = Object.values(pairs).flat().distinctValues();

let groupsOfN = Object.keys(pairs);
while (groupsOfN.length > 1) {
    groupsOfN = groupsOfN.map(group => group.split(','))
        .map(nodes => [allNodes.find(a => nodes.every(pairsWith(a))), ...nodes])
        .filter(([newNode]) => newNode)
        .map(nodes => nodes.sort().join())
        .distinctValues()
}

console.log({ res: groupsOfN.at(0) }); // am,aq,by,ge,gf,ie,mr,mt,rw,sn,te,yi,zb