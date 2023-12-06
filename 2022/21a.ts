import { readFileSync } from "fs"

const PARAM_1 = 0;
const OP = 1;
const PARAM_2 = 2;

const ops = {
    '+': (a: number, b: number) => a+b,
    '-': (a: number, b: number) => a-b,
    '*': (a: number, b: number) => a*b,
    '/': (a: number, b: number) => a/b,
}

async function solve () {
    // Loop over unsolved until 'root'
    const all = readFileSync('21.in', 'utf-8').split(/\n/).map(v => v.split(': ') as [string, string]);
    const values = new Map(all.filter(([k, v]) => v.match(/^\d+$/)).map(([k, v]) => [k, Number(v)]));
    const functions: [string, [string, '+'|'-'|'*'|'/', string]][] = all.filter(([k, v]) => !values.has(k)).map(([k, v]) => [k, v.split(' ') as [string, '+'|'-'|'*'|'/', string]]);

    while (functions.length) {
        console.log(functions.length, functions);
        for (const [index, [key, func]] of functions.entries()) {
            if (values.has(func[PARAM_1]) && values.has(func[PARAM_2])) {
                const v = ops[func[OP]]!!(values.get(func[PARAM_1])!!, values.get(func[PARAM_2])!!);
                if (key === 'root') {
                    return v;
                }
                values.set(key, v);
                functions.splice(index, 1);
            }
        }
    }
}

solve().then(console.log)

//8 between 6-8 cells,
//3 below,
