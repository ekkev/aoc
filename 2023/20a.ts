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
}>

const senders = Object.fromEntries(Object.values(map).filter(v => v.prefix === '&')
    .map(v => [v.mod, Object.fromEntries(Object.values(map)
            .filter(e => (e.targets as string[]).includes(v.mod))
            .map(e => [e.mod, 0]))]
    ));

const q = [] as [string, string, number][]; // from, to, pulse
const sent = [0, 0]; // lo, hi
const send = (from: string, signal: number) => map[from].targets.map(to => q.push([from, to, signal]) && sent[signal]++)

for (let i = 0; i < 1000; i++) {
    q.push(['button', 'broadcaster', 0]);
    sent[0]++;
    while (q.length) {
        const [sender, mod, pulse] = q.shift()!;
        if (!(mod in map)) continue;

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

console.log({result: product(sent), sent })
// 818723272