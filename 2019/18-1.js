const { prettyPicture } = require('./15-2');

const [X, Y] = [0, 1];
const START = '@';
const [a, z, A, Z] = ['a', 'z', 'A', 'Z'].map(v => v.charCodeAt());
const isKey = chr => chr.charCodeAt() >= a && chr.charCodeAt() <= z;
const isDoor = chr => chr.charCodeAt() >= A && chr.charCodeAt() <= Z;
const keyForDoor = door => door.toLowerCase();
const getPosId = ([x, y]) => `${x}:${y}`;

const createMap = input => {
    const map = new Map;
    const getMapRow = y => map.has(y) ? map.get(y) : map.set(y, new Map).get(y);
    const setMap = (x, y, value) => getMapRow(y).set(x, value);
    const getMap = (x, y) => getMapRow(y).get(x);

    let [x, y] = [0, 0];
    let locations = {};

    input.split('').forEach((v,i) => {
        if (v === '\n') {
            x = 0; y++;
        } else {
            if (v === START || isKey(v) || isDoor(v)) {
                locations[v] = [x, y];
            }
            if (v === START) {
                v = '.';
            }
            setMap(x, y, v);
            x++;
        }
    });
    // prettyPicture(map, v => v=='.' ? ' ' : v);
    return [map, locations];
}

const shortestPathtoEachKey = (map, start) => {
    const getMapItem = (map, y, def = new Map) => map.has(y) ? map.get(y) : map.set(y, def).get(y);
    const getMap = ([x, y]) => getMapItem(map, y).get(x);

    // DFS through the explorable map, remember shortest path to each key + doors on the way
    const keyPaths = {};

    const storeKeyPathIfGood = (key, doors, path) => {
        if (!(key in keyPaths)) {
            keyPaths[key] = new Set;
        }
        keyPaths[key].add(doors.sort().join(''));
    }

    const dfsFindKeys = (pos, doors = [], path = []) => {
        const chr = getMap(pos);
        if (chr === '#' || chr === undefined)
            return;

        if (isKey(chr)) {
            storeKeyPathIfGood(chr, doors, path);
        }

        if (isDoor(chr)) {
            doors = [...doors, chr];
        }

        const moves = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        moves.forEach(([x, y]) => {
            const newPos = [pos[X] + x, pos[Y] + y];
            const posId = getPosId(newPos);
            if (!path.includes(posId))
                dfsFindKeys(newPos, doors, [...path, posId]);
        })
    }

    dfsFindKeys(start);
    return keyPaths;
}

// Return keypaths where any path has no doors
const reachableKeys = (keyPaths, collectedKeys) =>
                                Object.keys(keyPaths)
                                      .filter(key => !collectedKeys.includes(key))
                                      .filter(key => [...keyPaths[key]]
                                                            .map(doors => doors.split('').filter(door => !collectedKeys.includes(keyForDoor(door))))
                                                            .some(p => !p.length)
                                      );

const solve = (input) => {
    const [map, locations] = createMap(input);
    const keysToCollect = new Set(Object.keys(locations).filter(isKey));
    const doorsOnTheWay = shortestPathtoEachKey(map, locations[START]);

    const getMapRow = y => map.has(y) ? map.get(y) : map.set(y, new Map).get(y);
    const getMap = ([x, y]) => getMapRow(y).get(x);

    let shortestPathCache = new Map;
    const shortestPath = (source, target) => {
        let knownShortestPath = Infinity;

        let [sourceId, targetId] = [getPosId(source), getPosId(target)];
        if (!shortestPathCache.has(sourceId))
            shortestPathCache.set(sourceId, new Map);

        if (shortestPathCache.get(sourceId).has(targetId))
            return shortestPathCache.get(sourceId).get(targetId);

        const dfsFindShortestPath = (pos, target, path) => {
            if (pos[X] === target[X] && pos[Y] === target[Y]) {
                if (path.length < knownShortestPath) {
                    knownShortestPath = path.length;
                }
                return;
            }

            // If there's a key on the which we haven't collected, this is not the right solution
            if (isKey(getMap(pos)) && !path.includes(getPosId(pos)) && !(pos[X] === source[X] && pos[Y] === source[Y]))
                return;

            if (getMap(pos) === '#' || path.length > knownShortestPath)
                return;

            const moves = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            moves.forEach(([x, y]) => {
                const newPos = [pos[X] + x, pos[Y] + y];
                const posId = getPosId(newPos);
                if (!path.includes(posId))
                    dfsFindShortestPath(newPos, target, [...path, posId]);
            });
        }
        dfsFindShortestPath(source, target, []);

        if (!shortestPathCache.has(targetId))
            shortestPathCache.set(targetId, new Map);

        shortestPathCache.get(sourceId).set(targetId, knownShortestPath);
        shortestPathCache.get(targetId).set(sourceId, knownShortestPath);

        return knownShortestPath;
    }

    let minStepsAllKeys = Infinity;
    const pathCache = new Map;
    const getPathCacheId = (pos, keysCollected) => `${getPosId(pos)}:${[...keysCollected].sort().join('')}`
    const explorePaths = (pos, steps = 0,  keysCollected = []) => {
        let reachable = reachableKeys(doorsOnTheWay, keysCollected);
        if (keysCollected.length === keysToCollect.size) {
            return steps;
        }

        if (!reachable.length || steps === Infinity)
            return Infinity;

        const cacheId = getPathCacheId(pos, keysCollected);
        if (pathCache.has(cacheId)) {
            const fromCache = pathCache.get(cacheId);
            return fromCache[0] - fromCache[1] + steps;
        }

        reachable = reachable
                        .map(key => [shortestPath(pos, locations[key]), key])
                        .filter(([distance, key]) => steps + distance < minStepsAllKeys)
                        .sort(([a], [b]) => a-b);

        let result = [];
        let shortest = Infinity;

        for (let [distance, key] of reachable) {
            let pathLength = explorePaths(locations[key], steps + distance, [...keysCollected, key]);
            if (!keysCollected.length && pathLength < minStepsAllKeys)
                minStepsAllKeys = pathLength;
            if (pathLength < shortest)
                shortest = pathLength;
        }

        pathCache.set(cacheId, [shortest, steps]);
        return shortest;
    }

    return explorePaths(locations[START]);
}

let test = `########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`;

console.log(solve(test), 132, 'b, a, c, d, f, e, g');

test = `#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`;
console.log(solve(test), 136, 'a, f, b, j, g, n, h, d, l, o, e, p, c, i, k, m');

test = `########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`;
console.log(solve(test), 81, 'a, c, f, i, d, g, b, e, h');

test = `#################################################################################
#.................C...#...#.......#.....#.#.........#.R.....#.....B............t#
#.###################.#.#.###.#.###.#.#V#.#.#####.#.#.#####.#.#####.###########.#
#...Z...#.......#.....#.#...#.#...#.#.#.#.#.#.#...#.#.#...#...#...#.#.....#.#...#
#.#####.#.#####.#.#####.###.#.###.#.#.###.#.#.#.#####.#.#.#####.#.#.#.###.#.#.###
#.#.....#k..#...#...#...#.#.#...#...#...#...#.#.......#.#.....#.#n#.....#.#...#.#
#.#.#.#####.#.#####.#.#.#.#.#.#########.#.###.#########.#.#####.#.#######.#.###.#
#.#.#.#.....#.#...F.#.#.#...#.#...#...#.#.#............m#.#.....#.......#.#.#...#
#.#.###.#####.#.#######.#.#####.#.#.#.#.#.#####.#####.#####.###########.#.#.#.#.#
#.#...#.#.....#...#.....#.......#.#.#.#.#.....#.#...#.#.....#.....#.......#.#.#.#
#.###.#.#.#######.#.#############.#.#.#.#####.#.#.#.###.#####.###.#########.#.#.#
#.#...#.#.......#.#...#...#.....#.#.#.#.#...#...#.#.#...#..q..#.#.#.....#.....#.#
#.#.###.#######.#.#.#.###.#.#.###.#.#.#.#.#.#.###.#.#.###.#####.#.#.###.#######.#
#.#...........#.#.#.#...#...#...#.#.#...#.#.#.#...#...#...#.....#...#.#w..#...#i#
#.###########.#.#.#####.#.#####.#.#.###U###.#.#.#######.###.#########.###.#.#.###
#...#.#.....#.#.#.......#.#...#.#.#...#.#...#.#.....#...#.........#.....#...#...#
###.#.#.###.#.#.#########.###.#.#.#.#.#.#.###.#####.#.#.#####.#.###.#.#########.#
#.#.#.#.#.#.#.#.#.......#.....#.#.#.#.#.#...#.#...#.#.#.#...#.#.#...#s......#...#
#.#.#.#.#.#.###.#####.#.#####.#.#.###.#.#.#.#.#.###.#.###.#.#.#.#.#######.###.###
#.....#.#.......#...#.#...#...#...#...#.#.#...#...#.#.....#.#.#...#..x..#....d#.#
#######.#########.#.#####.#.#######.###.#.#######.#.#######J###.###.###.#######.#
#.....#...#...#.S.#.#j..#...........#.#.#.#.......#.#.....#...#...#.#.#.#.#.....#
#.###.###.#.#.#.###.###.#############.#.#.#.#####.#.#.#.#########.#.#.#.#.#.#.#.#
#.#.....#.#.#.....#...#.......#.........#...#.....#...#.........#...#...#.#.#.#.#
#.#####.#.#.#######.#.#######.###.###########.###########.#.#########.###.#.#.###
#.#.E.#.#.#.#...#...#...#...#...#.....#.#.....#...........#.#.....#...#..e..#...#
#.#.#.#.#H#X#.#.#.#.#####W#.###Q#####.#.#.#####.###.#########.###.#.###########.#
#...#.#...#.#.#.#.#.#...#.#...#.#...#.#.#...#.#...#.#...#...#.#.#.#.............#
#####.#####.#.#.#.###.#.#.###.#.#.###.#.###.#.###.#.#.#.#.#.#.#.#.#############.#
#...#.#.....#.#.#...D.#...#.#.#.#.....#.#...#...#.#.#.#...#...#.#.#...........#.#
###.#.#.#####.#############.#.#.#.#####.#.#####.#.###.#########.#.#.###.#.#####.#
#...#...#..........o........#...#......g#.....#.#.....#...#.#...#.#.#.K.#.#....h#
#.#.#####.###########.#################.#####.#.#######.#.#.#.#.#.#.#.#####.#####
#.#.....#.#.....#...#.........#.......#.#.#...#.....#...#.#...#.#...#...#...#...#
#.#######.###.#.#.#.#######.#.#######.#.#.#.###.###.#.###.#####.#######.#.#####.#
#.#.....#...#.#...#...#...#.#.........#.#.#...#...#.#.#...........#.....#.....#.#
#.#.###.###.#.#######.#.###.#####.#####.#.###.#.#.#.#.###########.#.#########.#.#
#.#.#.#...#...#.#.....#...#.....#.#.....#.#...#.#.#.#...#.........#.#.........#.#
#.#.#.###.#####.#.#######.#####.###.#####.#.#####.#.###.#.#########.#.#########.#
#.......#.....................#...................#.....#.........#.............#
#######################################.@.#######################################
#.......#...........#.....#.....................#.....#.......#...........#.....#
#.#######.#.#######.#.###.#.#####.#####.#.#.#####.#.#.#######.#.#########.#####.#
#.#.......#.....#...#...#.#.#...#.....#.#.#.......#.#.........#.#.......#...#...#
#.#.###########.#.#####.###.#.#.#####.#.#.#####.###.###########.#.###.#.###.#.###
#b..#...........#.....#...#.#.#.#.#...#.#.#...#...#...#.........#.#...#.#...#...#
#.###.###############.###.#.#.#.#.#.###.###.#.#######.#.#########.#.#.###.#####.#
#...#...........#...#.#...#.#.#...#.#...#...#.......#.#.#.......#.#.#.#...#.....#
###.###########.###.#.#.#.#.#.###.#.###.#.#########.#.#.#.#####.###.#.#.###.###.#
#.............#...#.....#.#...#...#...#.#.#.#.....#.#.#.#.#...#.....#.#....l#...#
#.#########.#####.#####.#######.#####G#.#.#.#.#O###.#.#.#.#.#.#.#####.#######.###
#.#...#...#.#...#...#...#.....#...#...#.#.#.#.#...#...#.#.#.#.#.#.Y.#.......#.#.#
#.#.#.#.#.###.#.#.#.###.#.###.###.#.###.#.#.#.###.#.###.#.#.#.###.#.#######.#.#.#
#.#.#a..#.....#.#.#...#.#.#.#.....#.#.#.#.#.#...#...#...#.#.#.....#.....#...#.#.#
###.###########.#####.###.#.#####.#.#.#.#.#.###.#####.###.#.###########.#.###.#.#
#...#..y#.....#.#...#.......#...#.#.#...#.#.........#.#.......#.#.......#.#...#.#
#.###.#.#.#.#.#.#.#.#.#######.#.#.#.###.#.#.#########.#######.#.#.#######.#.###.#
#.....#.#.#.#.#...#.#.#.......#.#.#...#.#.#.#.......#.....#z#.#.#.#.....#.#p..#.#
#######.###.#######.#.#.#######.#####.###.###.#####.#####.#.#.#.#A#.###.#.###.#.#
#.....#.....#.....#.#.#.....#.......#...#...#...#.....#...#.....#.#...#.....#.#.#
#.###.#####.#.###.#.#######.#######.###.#.#.#.###.###.#.#######.#.#.#########.#.#
#...#.......#.#.#...#.....#...#...#...#.#.#...#...#...#.......#.#.#.#.........#.#
###.#########.#.#.#######.#.#.###.###.#.#.#####.###.###########.#.###.#########.#
#...#...#...P.#...#.......#.#...#.#...#.#.#.....#...#.......#.#.#.....#...#.....#
#.###.###.###.#####.#########.#.#.#.###.#.#.#######.#.#####.#.#.#######.#.#####.#
#.....#...#...#.....#.......#.#.#...#...#.#.......#...#...#...#.#.......#.......#
#####.#.###.###.#####.#####.###.###.#.#.#.#######.#####.#.###.#.###.###.#########
#...#c#...#.#...#.....#...#...#...#.#.#u#.#.....#.....#.#.....#...#...#.#.......#
###.#.###.###.###.#####.#####.###.#.#.#.#.#.###.#####.#.#########.###.#.#.#####.#
#...#...#.L.#.#.#...#.......#.#...#...#.#.#.#.#.#...#.#.....#...#.#...#.......#.#
#.#####.###.#.#.#.#.#.#####.#.#.#######.#.#.#.#.###.#.#####.#.#.#.#.#####.#####.#
#...#...#.#...#...#.#.....#.#.#.#.....#.#.#.#.#.....#...#...#.#...#.#...#.#...#.#
###.#.###.#########.###.###.#.#.#####.#.#.#.#.#####.###.#.###.#######.#.###.#.#.#
#...#...#.........#...#.#...#...#.....#.#...#.#...#.#.#.#.#...#.....#.#...N.#.#.#
#.#####.#.#####.#.###.#.#.#######.#####.#####.#.#.#.#.#.###.###.###.#.#######.#T#
#.I.#...#.#.....#.....#.#...#...#.......#.#.....#.#.#.#...#.#.....#...#...#...#.#
#.#.#.###.#.###############.#.#.#.#######.#.#####.#.#.###.#.#####.#####.#.#.###.#
#.#...#...#.#.....#.........#.#.#...#...#...#...#.#.#...#.#f......#.#...#.#.....#
#.#########.#.#####.###.#####.#.###.#.#.#.###.#.#.#.###.#.#########.#.#.#######.#
#...........#..r....M.#.......#v......#.#.....#.#.......#.............#.........#
#################################################################################`;
console.log(solve(test), 4042);
