import { File } from "../2024/lib/file.ts";
import { protosArray } from "../2024/lib/array.ts";
import { protosString } from "../2024/lib/string.ts";
protosArray(); protosString();

const FILE = `2.in`;

let x = 0, y = 0;
const handleRow = (dir: string, val: number) => {
    switch(dir){
        case "forward":
            x += val; break;
        case "down":
            y += val; break;
        case "up":
            y -= val; break;

    }
}

const lines = File.tuples(FILE).forEach(([dir, val]) => handleRow(dir, Number(val)));


console.log({x,y, r: x*y})


