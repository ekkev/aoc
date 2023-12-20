import { fileAsLines } from "./lib/file.ts";
import { product } from "./lib/array.ts";

const input = fileAsLines('20.in').map(line => [...line.match(/^(%|&|)(\w+) -> (.*)/)!])
    .map(([_, prefix, mod, targets]) => [mod, {
        prefix, mod, state: 0, targets: targets.split(', ')
    }]);

const map = Object.fromEntries(input) as Record<string, {
    prefix: string;
    mod: string;
    state: number;
    targets: string[];
}>;
const list = Object.values(map);

const senders = Object.fromEntries(list.filter(v => v.prefix === '&')
    .map(v => [v.mod, Object.fromEntries(list
            .filter(e => (e.targets as string[]).includes(v.mod))
            .map(e => [e.mod, 0]))]
    ));


// Assuming all &'s near rx, so look for when we send positive signal to each of rx's grandparents
const rxsenders = list.filter(v => v.targets.includes('rx')).map(v => v.mod);
const tofind = Object.fromEntries(rxsenders.map(s => Object.keys(senders[s])).flat().map(k => [k, 0]))

const q = [] as [string, string, number][]; // from, to, pulse
const send = (from: string, signal: number) => map[from].targets.map(to => q.push([from, to, signal]))

for (let i = 1; i < 100000; i++) {
    q.push(['button', 'broadcaster', 0]);
    while (q.length) {
        const [sender, mod, pulse] = q.shift()!;

        if (mod==='rx') {
            if (pulse) continue;
            console.log(i) // Will never make it here...
            break;
        }

        // Had cycle detection, but seems like cycles start from the beginning neatly,
        // so removed it and detecting only first occurrance for each grandparent
        if (sender in tofind && !tofind[sender] && pulse) {
            tofind[sender] = i;
            console.log('GOT', {i, sender});

            const values = Object.values(tofind);
            if (!values.includes(0)) {
                // Maybe should lcm for more generic solution but simply multiplying the loops worked
                // as they all start from the start
                console.log({result: product(values)}); //243902373381257
                Deno.exit()
            }
        }

        const {prefix} = map[mod];
        if (prefix === '%') {
            if (!pulse) {
                map[mod].state = +!map[mod].state;
                send(mod, map[mod].state);
            }
        }

        if (prefix === '&') {
            senders[mod][sender] = pulse;
            send(mod, +!!Object.values(senders[mod]).includes(0)); //=high for all
        }

        if (mod === 'broadcaster') {
            send(mod, pulse);
        }
    }
}

