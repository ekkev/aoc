import { readFileSync } from 'node:fs';

const input = readFileSync('24.in', 'ascii').split(/\n/)
    .map(str => [...str.matchAll(/-?\d+/g)].map(m => parseInt(m[0])))
    .slice(0,3)
    .map(([x, y, z, dx, dy, dz], i) => ({i, x, y, z, dx, dy, dz}));

(async () => {
    // Runs only with ts-node (not Deno) because of this line.. can't move to import as ts types on `new Context` error then
    const { init } = require('z3-solver');

    const { Context, em } = await init();
    const { Solver, Int, ast_from_string } = new Context('main');
    const solver = new Solver();

    const addeq = (h: Record<string, number>, dim: 'x' | 'y' | 'z') => {
        // A.x + t0 * A.dx === R.x + t0 * R.dx
        solver.add(
            Int.const(`t${h.i}`).mul(h[`d${dim}`]).add(h[dim])
            .eq(Int.const(`t${h.i}`).mul(Int.const(`d${dim}`)).add(Int.const(dim)))
        );
    }

    input.forEach(star => {
        addeq(star, 'x');
        addeq(star, 'y');
        addeq(star, 'z');
    });

    await solver.check()
    const model = solver.model();
    const [x, y, z] = [model.eval(Int.const('x')).value(), model.eval(Int.const('y')).value(), model.eval(Int.const('z')).value()]
    console.log({x, y, z, res: x+y+z});
    em.PThread.terminateAllThreads();
})();

// 1033770143421619
