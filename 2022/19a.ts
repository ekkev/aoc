import { lineByLine } from "./file";

const GEO = 3;
const OBS = 2;
const CLAY = 1;
const ORE = 0;

type Materials = [number, number, number, number ];
type Pair = [Materials, Materials];
const sortkey = (have: Materials, make: Materials) => 
    1000*((make[ORE]+have[ORE])+(make[CLAY]+have[CLAY])*100+(make[OBS]+have[OBS])*10000+(make[GEO]+have[GEO])*1000000)
        + (make[ORE]+make[CLAY]*100+make[OBS]*10000+make[GEO]*1000000)

const prune = (x: [Materials, Materials][]) =>

    x.map((([have, make]: Pair) => [sortkey(have, make), [have, make]] as [number, Pair]))
    .sort((a, b) => b[0]-a[0])
    // .map((v,i) => { if (i<10) { console.log(v) }; return v; })
    .slice(0, 1000)
    .map(([_, v]) => v);


const canAffordMove = (cost: Materials, have: Materials) => cost.every((v,i) => have[i] >= v);
const calculateStore = (have: Materials, make: Materials, cost: Materials) =>
    have.map((v, i) => v + make[i] - cost[i]) as Materials;
const calculateRobots = (make: Materials, more: Materials) =>
    make.map((v, i) => v + more[i]) as Materials;


const optimise_geo = (blueprint: [Materials, Materials][]) => {
    let todo: Pair[] = [[[0,0,0,0], [1,0,0,0]]];
    for (let time = 24; time > 0; time--) {
        
        let nextTodo: Pair[] = [];
        for (const [have, make] of todo) {
            for (const [cost, more] of blueprint) {
                if (canAffordMove(cost, have)) {
                    nextTodo.push([ calculateStore(have, make, cost), calculateRobots(make, more) ])
                }
            }
        }
        // console.log(time, todo.length, { max: Math.max.apply(null, todo.map(v => v[HAVE][GEO]))})
        todo = prune(nextTodo);
    }

    const m = Math.max.apply(null, todo.map(v => v[0][3]))
    // console.log('M', m);
    return m;
}


const solve = async () => {
    let solution = 0;
    for await (const line of await lineByLine('19.in')) {
        const m = line.match(/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./);
        if (!m) throw new Error;
        const [_, blueprint, ore_ore, clay_ore, obs_ore, obs_clay, geo_ore, geo_obs] = m.map(v => parseInt(v));
        // console.log({blueprint, ore_ore, clay_ore, obs_ore, obs_clay, geo_ore, geo_obs});

        const max_geo = optimise_geo([
            // cost        more (build)
            [[ore_ore, 0, 0, 0], [1, 0, 0, 0]], // Ore
            [[clay_ore, 0, 0, 0], [0, 1, 0, 0]], // Clay
            [[obs_ore, obs_clay, 0, 0], [0, 0, 1, 0]], // Obs
            [[geo_ore, 0, geo_obs, 0], [0, 0, 0, 1]], // Geo
            [[0, 0, 0, 0], [0, 0, 0, 0]], // No build
        ]);

        console.log({blueprint, max_geo})
        solution += blueprint * max_geo;
    }

    return solution;
}

solve().then(console.log) // 1413