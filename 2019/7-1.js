console.debug = () => {};

const Intcpu = (()=>{
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
    
    return (program, userInputs) => {
        let arr = program.split(',').map(s => parseInt(s, 10));
    
        let pos = 0;
        let prevOpcode = undefined;
        let lastOutput = undefined;
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
                    let userInput = userInputs.shift();
                    arr[paramPos[0]] = userInput;
                    console.debug('Input', arr[paramPos[2]], 'to', paramPos[2]);
                    pos += paramCount[opcode] + 1;
                break;
                case 4:
                    console.log('OUTPUT', arr[paramPos[0]], ' from ', paramPos[0], paramMode);
                    lastOutput = arr[paramPos[0]];
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
                    // return arr;
                    return lastOutput;
                default:
                    console.error('Unimplemented opcode', opcode);
            }
            prevOpcode = opcode;
        }
        console.error('Error: out of index', pos);
    }
    

})();

const phaseIterate = (phases, input, program, maxOutput) => {
    for (let phase of phases) {
        let output = Intcpu(program, [phase, input]);
        if (phases.size > 1) {
            let nextPhases = new Set(phases);
            nextPhases.delete(phase);
            phaseIterate(nextPhases, output, program, maxOutput);
        } else if (output > maxOutput.value) {
            maxOutput.value = output;
        }
    }
}

const solve = program => {
    let maxOutput = {'value': -Infinity};
    let phases = new  Set([0, 3, 2, 1, 4]);
    phaseIterate(phases, 0, program, maxOutput);
    return maxOutput.value;
};


let test = `3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0`;
console.log(solve(test), 43210);

test = `3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0`;
console.log(solve(test), 54321);

test = `3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0`;
console.log(solve(test), 65210);

let input = `3,8,1001,8,10,8,105,1,0,0,21,34,51,76,101,126,207,288,369,450,99999,3,9,102,4,9,9,1001,9,2,9,4,9,99,3,9,1001,9,2,9,1002,9,3,9,101,3,9,9,4,9,99,3,9,102,5,9,9,1001,9,2,9,102,2,9,9,101,3,9,9,1002,9,2,9,4,9,99,3,9,101,5,9,9,102,5,9,9,1001,9,2,9,102,3,9,9,1001,9,3,9,4,9,99,3,9,101,2,9,9,1002,9,5,9,1001,9,5,9,1002,9,4,9,101,5,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99`;
console.log(solve(input));