const paramCount = {
    1: 3,
    2: 3,
    3: 1,
    4: 1,
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    99: 0,
};

const OPCODE = {
    Add: 1,
    Multiply: 2,
    Input: 3,
    Output: 4,
    JumpIfTrue: 5,
    JumpIfFalse: 6,
    LessThan: 7,
    Equals: 8,
    Exit: 99,
};

const OPFUNC = {
    [OPCODE.Add]: {
        params: 3,
        fn: (arr, paramPos) => {
            
        }
    }
}

const solve = (input) => {
    let arr = input.split(',').map(s => parseInt(s, 10));

    let pos = 0;
    let prevOpcode = undefined;
    while (pos in arr) {
        let instruction = arr[pos];
        let opcode = instruction % 100; // Rightmost 2 digits are op code
        let paramModes = parseInt(Math.floor(instruction / 100).toString(), 2);
        let paramMode = [paramModes & 1, paramModes>>1 & 1, paramModes>>2 & 1];
        let paramPos = paramMode.map((mode, index) => ( mode ? pos + index + 1 : arr[pos + index + 1] ));

        // console.debug('Step', pos, [arr[pos], arr[pos+1], arr[pos+2], arr[pos+3], arr[pos+4]].slice(0, paramCount[opcode] + 1));

        switch (opcode) {
            case 1:
                arr[paramPos[2]] = arr[paramPos[0]] + arr[paramPos[1]];
                console.debug('Add', arr[paramPos[2]], 'to', paramPos[2]);
                pos += paramCount[opcode] + 1;
            break;
            case 2:
                arr[paramPos[2]] = arr[paramPos[0]] * arr[paramPos[1]];
                console.debug('Multiply', arr[paramPos[2]], 'to', paramPos[2]);
                pos += paramCount[opcode] + 1;
            break;
            case 3:
                let userInput = 5; // magic value from assignment
                arr[paramPos[0]] = userInput;
                console.debug('Input', arr[paramPos[2]], 'to', paramPos[2]);
                pos += paramCount[opcode] + 1;
            break;
            case 4:
                console.log('OUTPUT', arr[paramPos[0]], ' from ', paramPos[0], paramMode);
                pos += paramCount[opcode] + 1;
            break;
            case 5:
                console.debug('JumpIfTrue', arr[paramPos[0]]);
                if (arr[paramPos[0]]) {
                    pos = arr[paramPos[1]];
                } else {
                    pos += paramCount[opcode] + 1;
                }
            break;
            case 6:
                console.debug('JumpIfFalse', arr[paramPos[0]]);
                if (!arr[paramPos[0]]) {
                    pos = arr[paramPos[1]];
                } else {
                    pos += paramCount[opcode] + 1;
                }
            break;
            case 7:
                console.debug('LessThan', arr[paramPos[0]], arr[paramPos[1]]);
                if (arr[paramPos[0]] < arr[paramPos[1]]) {
                    arr[paramPos[2]] = 1;
                } else {
                    arr[paramPos[2]] = 0;
                }
                pos += paramCount[opcode] + 1;
            break;
            case 8:
                console.debug('Equalds', arr[paramPos[0]], arr[paramPos[1]]);
                if (arr[paramPos[0]] == arr[paramPos[1]]) {
                    arr[paramPos[2]] = 1;
                } else {
                    arr[paramPos[2]] = 0;
                }
                pos += paramCount[opcode] + 1;
            break;
            case 99:
                console.log('Final:', ['after', prevOpcode], arr);
                return arr;
            default:
                console.error('Unimplemented opcode', opcode);
        }
        prevOpcode = opcode;
    }
    console.error('Error: out of index', pos);
}


const input = `3,225,1,225,6,6,1100,1,238,225,104,0,1101,33,37,225,101,6,218,224,1001,224,-82,224,4,224,102,8,223,223,101,7,224,224,1,223,224,223,1102,87,62,225,1102,75,65,224,1001,224,-4875,224,4,224,1002,223,8,223,1001,224,5,224,1,224,223,223,1102,49,27,225,1101,6,9,225,2,69,118,224,101,-300,224,224,4,224,102,8,223,223,101,6,224,224,1,224,223,223,1101,76,37,224,1001,224,-113,224,4,224,1002,223,8,223,101,5,224,224,1,224,223,223,1101,47,50,225,102,43,165,224,1001,224,-473,224,4,224,102,8,223,223,1001,224,3,224,1,224,223,223,1002,39,86,224,101,-7482,224,224,4,224,102,8,223,223,1001,224,6,224,1,223,224,223,1102,11,82,225,1,213,65,224,1001,224,-102,224,4,224,1002,223,8,223,1001,224,6,224,1,224,223,223,1001,14,83,224,1001,224,-120,224,4,224,1002,223,8,223,101,1,224,224,1,223,224,223,1102,53,39,225,1101,65,76,225,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,1107,677,226,224,1002,223,2,223,1005,224,329,101,1,223,223,8,677,226,224,102,2,223,223,1006,224,344,1001,223,1,223,108,677,677,224,1002,223,2,223,1006,224,359,1001,223,1,223,1108,226,677,224,102,2,223,223,1006,224,374,1001,223,1,223,1008,677,226,224,102,2,223,223,1005,224,389,101,1,223,223,7,226,677,224,102,2,223,223,1005,224,404,1001,223,1,223,1007,677,677,224,1002,223,2,223,1006,224,419,101,1,223,223,107,677,226,224,102,2,223,223,1006,224,434,101,1,223,223,7,677,677,224,1002,223,2,223,1005,224,449,101,1,223,223,108,677,226,224,1002,223,2,223,1006,224,464,101,1,223,223,1008,226,226,224,1002,223,2,223,1006,224,479,101,1,223,223,107,677,677,224,1002,223,2,223,1006,224,494,1001,223,1,223,1108,677,226,224,102,2,223,223,1005,224,509,101,1,223,223,1007,226,677,224,102,2,223,223,1005,224,524,1001,223,1,223,1008,677,677,224,102,2,223,223,1005,224,539,1001,223,1,223,1107,677,677,224,1002,223,2,223,1006,224,554,1001,223,1,223,1007,226,226,224,1002,223,2,223,1005,224,569,1001,223,1,223,7,677,226,224,1002,223,2,223,1006,224,584,1001,223,1,223,108,226,226,224,102,2,223,223,1005,224,599,1001,223,1,223,8,677,677,224,102,2,223,223,1005,224,614,1001,223,1,223,1107,226,677,224,102,2,223,223,1005,224,629,1001,223,1,223,8,226,677,224,102,2,223,223,1006,224,644,1001,223,1,223,1108,226,226,224,1002,223,2,223,1006,224,659,101,1,223,223,107,226,226,224,1002,223,2,223,1006,224,674,1001,223,1,223,4,223,99,226`;
// let input = '1101,100,-1,4,0';
console.log(solve(input));

// Expect output 8834787