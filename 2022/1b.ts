import { readFileSync } from "fs";

async function main () {
    const filename = '1.in';
    const file = readFileSync(filename, 'ascii')
    const elves = file.split('\n\n')
    const allCalories = elves.map((list) => {
        const calories = list.split('\n').reduce((sum, row) => sum += parseInt(row, 10), 0)
        return calories
    })
    allCalories.sort((a, b) => b-a)

    console.log(allCalories[0] + allCalories[1] + allCalories[2])
}

main().catch(err => console.error(err))