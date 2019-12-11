
const Intcpu = (programCode, id = 'cpu') => {

    const ParamMode = {
        Position: 0,
        Value: 1,
        Relative: 2,
    };

    const OpCode = {
        Add: 1,
        Multiply: 2,
        Input: 3,
        Output: 4,
        JumpIfTrue: 5,
        JumpIfFalse: 6,
        LessThan: 7,
        Equals: 8,
        RelativeBase: 9,
        Exit: 99,
    };

    const OpFunc = {
        [OpCode.Add]: (p1, p2, p3) => memory[p3] = (memory[p1] || 0) + (memory[p2] || 0),
        [OpCode.Multiply]: (p1, p2, p3) => memory[p3] = (memory[p1] || 0) * (memory[p2] || 0),
        [OpCode.Input]: p1 => userInput => memory[p1] = userInput,
        [OpCode.Output]: p1 => ({ output: memory[p1], end: false }),
        [OpCode.JumpIfTrue]: (p1, p2) => ({ setPos: memory[p1] ? memory[p2] : undefined }),
        [OpCode.JumpIfFalse]: (p1, p2) => ({ setPos: !memory[p1] ? memory[p2] : undefined }),
        [OpCode.LessThan]: (p1, p2, p3) => memory[p3] = +(memory[p1] < memory[p2]),
        [OpCode.Equals]: (p1, p2, p3) => memory[p3] = +(memory[p1] == memory[p2]),
        [OpCode.RelativeBase]: p1 => relativeBase += memory[p1],
        [OpCode.Exit]: () => ({ end: true }),
    };

    let pos = 0;
    let relativeBase = 0;
    let memory = programCode.split(',').map(s => parseInt(s, 10));

    // Rightmost 2 digits are op code, the rest are up to three param position modes
    const parseInstruction = (memory, pos, paramModes = Math.floor(memory[pos] / 100)) => ({
        opcode: memory[pos] % 100,
        paramPos: [paramModes % 10, Math.floor(paramModes/10) % 10, Math.floor(paramModes/100) % 10]
            .map((mode, index) => {
                switch (mode) {
                    case ParamMode.Value:    return pos + index + 1;
                    case ParamMode.Position: return memory[pos + index + 1];
                    case ParamMode.Relative: return relativeBase + memory[pos + index + 1]
                }
            }),
    });

    const runOpCode = (opcode, paramPos, userInputs) => {
        if (!(opcode in OpFunc)) {
            throw new Error(`Unimplemented opcode ${opcode}`);
        }

        let returnValue = OpFunc[opcode](...paramPos);
        pos += OpFunc[opcode].length + 1;

        if (typeof returnValue === 'function') {
            if (typeof userInputs === 'function') {
                returnValue = returnValue(userInputs());
            } else {
                if (!userInputs.length) {
                    throw new Error('User input expected');
                }
                returnValue = returnValue(userInputs.shift());
            }
        }

        return returnValue;
    };

    const runUntilOutput = (userInputs) => {
        while (pos in memory) {
            let { opcode, paramPos } = parseInstruction(memory, pos);
            let returnValue = runOpCode(opcode, paramPos, userInputs);

            if (typeof returnValue !== 'object') {
                continue;
            }

            if (returnValue.setPos !== undefined) {
                pos = returnValue.setPos;
            }

            if (returnValue.output !== undefined || returnValue.end) {
                return returnValue;
            }
        }
        throw new Error(`Out of bounds ${pos}`);
    };
    
    const runWithIO = (outputFn, inputFn = () => { throw new Error('User input needed') }) => {
        let ret;
        do {
            ret = runUntilOutput(inputFn);
            if ('output' in ret) {
                outputFn(ret.output);
            }
        } while (!ret.end);
    }

    return {
        runUntilOutput,
        runWithIO,
    }
};

const numericSort = { Asc: (a,b) => a-b, Desc: (a,b) => b-a };
const mapValues = map => Array.from(map.values());
const mapKeys = map => Array.from(map.keys());

const Dir = {
    UP:    {x:  0, y:  1},
    RIGHT: {x:  1, y:  0},
    DOWN:  {x:  0, y: -1},
    LEFT:  {x: -1, y:  0},
};

const Turn = {
    LEFT: 0,
    RIGHT: 1,
};

const turns = { [Turn.LEFT]: [Dir.UP, Dir.RIGHT, Dir.DOWN, Dir.LEFT, Dir.UP] };
turns[Turn.RIGHT] = [...turns[Turn.LEFT]].reverse()

const getDirectionAfterTurn = (direction, turn) => turns[turn][turns[turn].indexOf(direction) + 1];
const moveOneStep = (x, y, direction) => [x + direction.x, y + direction.y];

const BLACK = 0;

const solve = (programCode, { startColor, countPainted, prettyPicture }) => {
    const cpu = Intcpu(programCode);

    let [x, y] = [0, 0];
    let direction = Dir.UP;

    const image = new Map;
    const getImageRow = y => image.has(y) ? image.get(y) : image.set(y, new Map).get(y);

    getImageRow(y).set(x, startColor);

    const getProgramInput = () => getImageRow(y).get(x) || BLACK;
    const setPixelColor   = color => getImageRow(y).set(x, color);
    const turnAndMove     = turn => {
        direction = getDirectionAfterTurn(direction, turn);
        [x, y] = moveOneStep(x, y, direction);
    }

    const outputHandlers = [ setPixelColor, turnAndMove ];
    const handleProgramOutput = output => outputHandlers.reverse()[1](output);

    cpu.runWithIO(handleProgramOutput, getProgramInput);

    if (countPainted)
        return Array.from(image.values()).map(row => row.size).reduce((sum, len) => sum + len);

    if (prettyPicture) {
        const fillCellIfEmpty = row => x => row.has(x) || row.set(x, BLACK)
        const fillEmptyCells  = range => row => range.map(fillCellIfEmpty(row));

        const sortedKeys      = map => mapKeys(map).sort(numericSort.Desc); // Output a mirror image by sorting x and y descending
        const keySortedValues = map => sortedKeys(map).map(key => map.get(key));
        const colorToPixel    = color => ['  ', '■ '][color];
        const rowToPixels     = row => keySortedValues(row).map(colorToPixel);
        const mapToPixels     = map => sortedKeys(map).map(y => rowToPixels(map.get(y)).join(''));

        const [minX, maxX] = Array.from(image, ([y, row]) => [Math.min(...row.keys()), Math.max(...row.keys())])
                                .reduce(([min, max], [curMin, curMax]) => [Math.min(curMin, min), Math.max(curMax, max)], [Infinity, -Infinity]);

        const xRange = Array.from(Array(maxX - minX + 1), (_, v) => v + minX);
        mapValues(image).forEach(fillEmptyCells(xRange));
        return mapToPixels(image).join('\n');
    }
}

let input = `3,8,1005,8,314,1106,0,11,0,0,0,104,1,104,0,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,1,8,10,4,10,1002,8,1,28,2,2,16,10,1,1108,7,10,1006,0,10,1,5,14,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,1,8,10,4,10,102,1,8,65,1006,0,59,2,109,1,10,1006,0,51,2,1003,12,10,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,1001,8,0,101,1006,0,34,1,1106,0,10,1,1101,17,10,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,0,10,4,10,1001,8,0,135,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,1001,8,0,156,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,1001,8,0,178,1,108,19,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,0,8,10,4,10,1002,8,1,204,1,1006,17,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,1,8,10,4,10,102,1,8,230,1006,0,67,1,103,11,10,1,1009,19,10,1,109,10,10,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,0,10,4,10,101,0,8,268,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,1,10,4,10,1002,8,1,290,2,108,13,10,101,1,9,9,1007,9,989,10,1005,10,15,99,109,636,104,0,104,1,21101,48210224024,0,1,21101,0,331,0,1105,1,435,21101,0,937264165644,1,21101,0,342,0,1105,1,435,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21101,235354025051,0,1,21101,389,0,0,1105,1,435,21102,29166169280,1,1,21102,400,1,0,1105,1,435,3,10,104,0,104,0,3,10,104,0,104,0,21102,709475849060,1,1,21102,1,423,0,1106,0,435,21102,868498428684,1,1,21101,434,0,0,1105,1,435,99,109,2,21201,-1,0,1,21101,0,40,2,21102,1,466,3,21101,456,0,0,1105,1,499,109,-2,2105,1,0,0,1,0,0,1,109,2,3,10,204,-1,1001,461,462,477,4,0,1001,461,1,461,108,4,461,10,1006,10,493,1101,0,0,461,109,-2,2106,0,0,0,109,4,2102,1,-1,498,1207,-3,0,10,1006,10,516,21102,1,0,-3,21201,-3,0,1,21201,-2,0,2,21102,1,1,3,21102,535,1,0,1106,0,540,109,-4,2106,0,0,109,5,1207,-3,1,10,1006,10,563,2207,-4,-2,10,1006,10,563,21202,-4,1,-4,1106,0,631,21201,-4,0,1,21201,-3,-1,2,21202,-2,2,3,21101,582,0,0,1105,1,540,22102,1,1,-4,21102,1,1,-1,2207,-4,-2,10,1006,10,601,21101,0,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,623,22102,1,-1,1,21101,623,0,0,105,1,498,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2105,1,0`;

console.log(solve(input, { startColor: 0, countPainted: 1, prettyPicture: 1 }), 2343);
console.log(solve(input, { startColor: 1, prettyPicture: 1 }));