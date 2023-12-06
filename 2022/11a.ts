const monkeys: Array<{
    items: number[],
    op: (v: number) => number,
    next: (v: number) => number,
    inspects: number,
}> = [
    {
        items: [50, 70, 54, 83, 52, 78],
        op: v => v * 3,
        next: v => v%11 ? 7 : 2,
        inspects: 0,
    },
    {
        items: [71, 52, 58, 60, 71],
        op: v => v * v,
        next: v => v%7 ? 2 : 0,
        inspects: 0,
    },
    {
        items: [66, 56, 56, 94, 60, 86, 73],
        op: v => v + 1,
        next: v => v%3 ? 5 : 7,
        inspects: 0,
    },
    {
        items: [83, 99],
        op: v => v + 8,
        next: v => v%5 ? 4 : 6,
        inspects: 0,
    },
    {
        items: [98, 98, 79],
        op: v => v + 3,
        next: v => v%17 ? 0 : 1,
        inspects: 0,
    },
    {
        items: [76],
        op: v => v + 4,
        next: v => v%13 ? 3 : 6,
        inspects: 0,
    },
    {
        items: [52, 51, 84, 54],
        op: v => v * 17,
        next: v => v%19 ? 1 : 4,
        inspects: 0,
    },
    {
        items: [82, 86, 91, 79, 94, 92, 59, 94],
        op: v => v + 7,
        next: v => v%2 ? 3 : 5,
        inspects: 0,
    },
];

async function main () {
    for (let round = 0; round < 20; round++) {
        for (const monkey of monkeys) {
            monkey.items.forEach(worry => {
                monkey.inspects++;
                const newWorry = Math.floor(monkey.op(worry) / 3)
                const nextMonkey = monkey.next(newWorry);
                monkeys[nextMonkey].items.push(newWorry)
            })
            monkey.items = []
        }
        console.log(round)
    }

    return monkeys.map(monkey => monkey.inspects).sort((a,b)=>b-a).slice(0, 2).reduce((tot, v) => tot * v, 1)
}

main().then(console.log);