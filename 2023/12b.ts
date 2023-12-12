import { fileAsTuples } from "./lib/file.ts";
import { ints } from "./lib/string.ts";

const lines = fileAsTuples('12.in').map(([a,b]) => [a, ints(b)] as [string, number[]]);

let result = 0;
for (let [str, broken] of lines) {
    str = Array(5).fill(str).join('?');

    const seen: Record<string, number> = {};
    const combinations = (groups: number[], pos = 0): number => {
        const key = [groups.length, pos].join();

        if (key in seen)
            return seen[key];

        if (!groups.length)
            return Number(!str.substring(pos).includes('#'))

        const end = pos + groups[0];
        let res = 0;

        if (end > str.length)
            return seen[key] = 0;

        if (str[pos] === '.')
            return seen[key] = combinations(groups, pos + 1);

        // '?' as a '.'
        if (str[pos] === '?') 
            res += combinations(groups, pos + 1);
        
        // '?' as a '#' and actual '#'
        if (str.substring(pos, end).includes('.') || str[end] === '#')
            return seen[key] = res;

        return seen[key] = res + combinations(groups.slice(1), end + 1);
    }

    result += combinations(Array(5).fill(broken).flat());
}

console.log({result})
// 3476169006222