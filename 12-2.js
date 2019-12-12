const DIMS = [['x', 'vx'], ['y', 'vy'], ['z', 'vz']];

const parseMoons = text => text.split('\n').map(moonStr => {
        let moon = {};
        moonStr.match(/([-\d]+)/g).forEach((pos, i) => moon[DIMS[i][0]] = parseInt(pos, 10) );
        DIMS.forEach(([dim, vdim]) => moon[vdim] = 0);
        return moon;
    });

const velocity = (a, b, dim) => a[dim] < b[dim] ? 1 : (a[dim] > b[dim] ? -1 : 0);

const calculateVelocity = (moons, [dim, vdim]) => moons.forEach(a => moons.forEach(b => a[vdim] += velocity(a, b, dim)));
const move = (moons, [dim, vdim]) => moons.forEach(moon => moon[dim] += moon[vdim]);
const positionId = (moons, [dim]) => moons.map(moon => moon[dim]).join(',');
const velocitiesZero = (moons, vdim) => moons.map(moon => moon[vdim] === 0).reduce((prev, cur) => prev && cur, true);
const findCommonInterval = (v1, v2) => {
    let res = v1;
    while (res % v2 !== 0) res += v1;
    return res;
}

const findIntervalInDimension = moons => ([dim, vdim]) => {
    let steps = 0;
    do {
        calculateVelocity(moons, [dim, vdim]);
        move(moons, [dim, vdim]);
        steps++;
    } while (!velocitiesZero(moons, vdim));

    return steps;
}

const solve =  (moonsText) => {
    const moons = parseMoons(moonsText);
    const intervals = DIMS.map(findIntervalInDimension(moons));
    return intervals.reduce(findCommonInterval, intervals[0]) * 2; // 2 = waveform back to beginning
}

let test = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;
console.log(solve(test), 2772);

test = `<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`;
console.log(solve(test), 4686774924);


test = `<x=-17, y=9, z=-5>
<x=-1, y=7, z=13>
<x=-19, y=12, z=5>
<x=-6, y=-6, z=-4>`;
console.log(solve(test), 325433763467176);
