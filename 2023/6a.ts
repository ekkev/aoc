import { fileAsLines } from "./lib/file.ts";
import { ints } from "./lib/string.ts";

const lines = fileAsLines('6.in');
const times = ints(lines.shift()!);
const dists = ints(lines.shift()!);

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

    // Original submission brute force:
    // for (let speed = 1; speed < time; speed++) {
    //     const rem = time - speed;
    //     if (rem * speed > target)
    //         results[race]++;
    // }
}

console.log({results, res: results.reduce((p, v)=>p*v, 1)})
// { results: [ 42, 54, 12, 23 ], res: 625968 }