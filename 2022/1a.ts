import { readFileSync } from "fs";

async function main () {
    const filename = '1.in';
    const file = readFileSync(filename, 'ascii')
    const elves = file.split('\n\n')
    const maxCalories = elves.reduce((currentMax, list) => {
        const calories = list.split('\n').reduce((sum, row) => sum += parseInt(row, 10), 0)
        return Math.max(calories, currentMax)
    }, 0)
    console.log(maxCalories)
}

main().catch(err => console.error(err))