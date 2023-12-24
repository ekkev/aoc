import { fileAsLines } from "./lib/file.ts";
import { ints } from "./lib/string.ts";

type RXYZ = {
    x: number;
    y: number;
    z: number;
};

const input = fileAsLines('24.in').map(ints).map(([a,b,c,d,e,f]) => [{x:a,y:b,z:c}, {x:d,y:e,z:f}]) as [RXYZ, RXYZ][];

// const [min,max] = [7,27]
const [min,max] = [200000000000000,400000000000000]
let result = 0;

for (const [idx, one] of input.entries()) {
    const [A, VA] = one;
    for (let j = idx+1; j < input.length; j++) {
        const [B, VB] = input[j];

        // ax + t*vax = bx + t1*vbx
        // ay + t*vay = by + t1*vby
        // t = (bx + t1*vbx - ax)/vax
        // (bx + t1*vbx - ax)/vax = (by + t1*vby - ay)/vay
        // bx/vax + t1*vbx/vax - ax/vax = by/vay + t1*vby/vay - ay/vay
        // t1 = (by/vay - ay/vay + ax/vax - bx/vax) / (vbx/vax - vby/vay) = ( (by-ay)/vay + (ax-bx)/vax ) / (vbx/vax - vby/vay)
        // t = (bx + ( (by-ay)/vay + (ax-bx)/vax ) / (vbx/vax - vby/vay)*vbx - ax)/vax
        const t = (B.x + ( (B.y-A.y)/VA.y + (A.x-B.x)/VA.x ) / (VB.x/VA.x - VB.y/VA.y) * VB.x - A.x) / VA.x;

        if (isNaN(t)) {
            continue;
        }

        const x = A.x + t * VA.x;
        const y = A.y + t * VA.y;

        const inbounds = x >= min && x <= max && y >= min && y <= max;
        if (!inbounds) {
            continue;
        }

        const onepast = (VA.x<0 && A.x<x) || (VA.x>0 && A.x>x) || (VA.y<0 && A.y<y) || (VA.y>0 && A.y>y);
        const twopast = (VB.x<0 && B.x<x) || (VB.x>0 && B.x>x) || (VB.y<0 && B.y<y) || (VB.y>0 && B.y>y);
        if (!onepast && !twopast) {
            result++;
        }
    }

    
}
console.log({result})
// 13149