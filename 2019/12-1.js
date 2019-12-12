const DIMS = [['x', 'vx'], ['y', 'vy'], ['z', 'vz']];

const parseMoons = text => text.split('\n').map(moon => ((xyz = moon.match(/([-\d]+)/g)) => ({ x: parseInt(xyz[0], 10),
                                                y: parseInt(xyz[1], 10),
                                                z: parseInt(xyz[2], 10),
                                                vx: 0, vy: 0, vz: 0
                                            }))());

const velocity = (a, b, dim) => a[dim] < b[dim] ? 1 : (a[dim] > b[dim] ? -1 : 0);

const calculateVelocities = moons => moons.forEach(a => moons.forEach(b => DIMS.forEach(([dim, vdim]) => a[vdim] += velocity(a, b, dim))));
const move = moons => moons.forEach(moon => DIMS.forEach(([dim, vdim]) => moon[dim] += moon[vdim]));

const solve =  (moonsText, stepTarget) => {
    const moons = parseMoons(moonsText);

    while (stepTarget-->0) {
        calculateVelocities(moons);
        move(moons)    
    }
    const absSum = (a, b) => Math.abs(a) + Math.abs(b);
    return moons.map(moon => DIMS.map(([dim, vdim]) => moon[dim]).reduce(absSum) * DIMS.map(([dim, vdim]) => moon[vdim]).reduce(absSum)).reduce((a, b) => a+b);
}

let test = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;
console.log(solve(test, 10), 179);

test = `<x=-17, y=9, z=-5>
<x=-1, y=7, z=13>
<x=-19, y=12, z=5>
<x=-6, y=-6, z=-4>`;
console.log(solve(test, 1000), 179);
