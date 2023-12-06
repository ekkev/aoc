import { readFileSync } from "fs";

// Determine which pairs of packets are already in the right order. 
// What is the sum of the indices of those pairs?
async function solve () {
    const pairs = readFileSync('13.in', 'utf-8').split(/\n\n/).map(el => el.split(/\n/).map(str => JSON.parse(str)));
    console.log(pairs);

    let pairIndex = 0;
    let sumRightOrderIndices = 0;

    for (const [l,r] of pairs) {
        pairIndex++;
        if (isInRightOrder(l, r)) {
            sumRightOrderIndices += pairIndex;
        }

    }

    return sumRightOrderIndices;
}

type ElementList = Array< number | ElementList>
const isInRightOrder = (left: ElementList, right: ElementList): boolean|undefined => {
    
    for (let i = 0; i < left.length; i++) {
        // If the right list runs out of items first, the inputs are not in the right order.
        if (i > right.length - 1) {
            return false;
        }

        let [l, r] = [left[i], right[i]];

        if (Array.isArray(l) && !Array.isArray(r)) {
            r = [r];
        } else if (!Array.isArray(l) && Array.isArray(r)) {
            l = [l];
        }

        if (Array.isArray(l) && Array.isArray(r)) {
            const subresult = isInRightOrder(l, r);
            if (subresult === true || subresult === false) { 
                return subresult;
            }
        } else {
            // If both values are integers, the lower integer should come first.
            if (l !== r) {
                return l < r;
            }
        }
    }

    // If the left list runs out of items first, the inputs are in the right order.
    if (left.length < right.length) {
        return true;
    }

    
    // If the lists are the same length and no comparison makes a decision about the order, 
    // continue checking the next part of the input
    return undefined;
}

solve().then(console.log);