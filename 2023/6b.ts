import { product } from "./lib/array.ts";
import { fileAsLines } from "./lib/file.ts";
import { ints } from "./lib/string.ts";

const lines = fileAsLines('6.in');
const times = ints(lines.shift()!.replaceAll(' ', ''));
const dists = ints(lines.shift()!.replaceAll(' ', ''));

console.log({times, dists});

const results = times.map(() => 0);

for (const race of times.keys()) {
    const target = dists[race];
    const time = times[race];

    /*
     Later optimization, math, with help from mr gpt:
      Quadratic ax^2 + bx + c = 0 => x = (-b += sq(b^2 - 4ac))/2a
      (time-speed) * speed = target
      time*speed - speed*speed = target
      time*speed = target + speed * speed
      speed*speed - time*speed + target = 0
      [chatgpt, help solve this equation for 'speed']
      speed = (time +- Math.sqrt(time*time - 4*target )) / 2;
     */
    const discriminant =  Math.sqrt(time*time - 4*target);
    const start = Math.ceil((time - discriminant) / 2);
    const end   = Math.ceil((time + discriminant) / 2);
    results[race] = end-start;

    // Earlier later optimization, half brute force, not-quite-binary-search from both ends
    // let [start, end] = [0,0];
    // for (let speed = 1; speed < time; speed++) {
    //     if ((time-speed) * speed > target) {
    //         start = speed;
    //         break;
    //     }
    // }

    // for (let speed = time; speed > 0; speed--) {
    //     if ((time-speed) * speed > target) {
    //         end = speed;
    //         break;
    //     }
    // }
    // results[race] = end-start+1;

    // Original submission brute force:
    // for (let speed = 1; speed < time; speed++) {
    //     if (0 == speed%1_000_000)
    //         console.log(speed);
    //     const rem = time - speed;
    //     if (rem * speed > target)
    //         results[race]++;
    // }
}

console.log({results, res: product(results)})
// { results: [ 43663323 ], res: 43663323 }