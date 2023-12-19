import { fileAsString } from "./lib/file.ts";
import { ints } from "./lib/string.ts";

const [allwfs, allparts] = fileAsString('19.in').split(/\n\n/);
const parts = allparts.split(/\n/).map(ints);
const wfs = allwfs.split(/\n/).map(r => r.split(/[{,}]/).filter(v=>v));

let result = 0;
for (const [x,m,a,s] of parts) {
    let wfname = 'in';
    do {
        const wflow = wfs.find(w => w[0] === wfname)!;

        for (const rule of wflow) {
            const [p,op,num,_,tgt] = rule.split(/([><:])/);
            if (!op) {
                wfname = p;
            } else {
                if (eval(`${p} ${op} ${num}`)) {
                    wfname = tgt;
                    break;
                }
            }
        }
    } while (wfname !== 'R' && wfname !== 'A');

    if (wfname === 'A') {
        result += x+m+a+s;
    }
}
console.log({result})
//409898