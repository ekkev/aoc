import { fileAsTuples } from "./lib/file.ts";
import { ints } from "./lib/string.ts";

const lines = fileAsTuples('12.in').map(([a,b]) => [a, ints(b)] as [string, number[]]);
let result = 0;
for (const [str, broken] of lines) {

    const combinations = (groups: number[], pos = 0): number => {
        if (!groups.length)
            return Number(!str.substring(pos).includes('#'))

        const end = pos + groups[0];
        let res = 0;

        if (end > str.length)
            return 0;

        if (str[pos] === '.')
            return combinations(groups, pos + 1);

        // '?' as a '.'
        if (str[pos] === '?') 
            res += combinations(groups, pos + 1);
        
        // '?' as a '#', and actual '#'
        if (str.substring(pos, end).includes('.') || str[end] === '#')
            return res;

        return res + combinations(groups.slice(1), end + 1);
    }

    result += combinations(broken);
}
console.log({result})
// 7007