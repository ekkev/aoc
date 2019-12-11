const solve = skymap => {
    const asteroids = new Set;
    skymap.split('\n').forEach((row, y) => {
        row.split('').forEach((v, x) => v !== '.' ? asteroids.add([x, y]) : undefined);
    });

    let maxVisible = {size: -Infinity, asteroid: undefined};
    asteroids.forEach(a => {
        let inclines = new Map, inclineValues = new Set;
        asteroids.forEach(b => {
            if (a === b) return;
            let incline = Math.atan2(a[1] - b[1], a[0] - b[0]);
            incline = (incline > 0 ? incline : (2*Math.PI + incline)) * 360 / (2*Math.PI);
            incline =  incline >= 90 ? incline - 90 : incline - 90 + 360;
            let asteroidsAtIncline = inclines.get(incline) || [];
            asteroidsAtIncline.push(b);
            inclines.set(incline, asteroidsAtIncline);

            inclineValues.add(incline);
        });

        if (inclines.size > maxVisible.size) {
            maxVisible = { size: inclines.size, asteroid: a, inclines, inclineValues };
        }
    });

    let inclineValuesSorted = [...maxVisible.inclineValues].sort((a,b) => a - b);
    let removed = 0, at200 = undefined;;
    while (inclineValuesSorted.length) {
        inclineValuesRemaining = [];
        inclineValuesSorted.forEach((incline, idx) => {
            let asteroidsAtIncline = maxVisible.inclines.get(incline);
            let asteroid = asteroidsAtIncline.shift();
            removed++;

            if (removed === 200) {
                at200 = asteroid;
            }
            if (asteroidsAtIncline.length > 0) {
                inclineValuesRemaining.push(incline);
            }
        });
        inclineValuesSorted = inclineValuesRemaining;
    }

    return at200[0] * 100 + at200[1];
}

let test = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`

console.log(solve(test), 802);

test = `.###.###.###.#####.#
#####.##.###..###..#
.#...####.###.######
######.###.####.####
#####..###..########
#.##.###########.#.#
##.###.######..#.#.#
.#.##.###.#.####.###
##..#.#.##.#########
###.#######.###..##.
###.###.##.##..####.
.##.####.##########.
#######.##.###.#####
#####.##..####.#####
##.#.#####.##.#.#..#
###########.#######.
#.##..#####.#####..#
#####..#####.###.###
####.#.############.
####.#.#.##########.`;

console.log(solve(test), 502);