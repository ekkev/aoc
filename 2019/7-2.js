
console.debug = () => {};

const Intcpu = (id, programCode) => {
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
    
    let pos = 0;
    let prevOpcode;
    let lastOutput;
    let program = programCode.split(',').map(s => parseInt(s, 10));


    const run = (userInputs) => {
        while (pos in program) {
            let instruction = program[pos];
            let opcode = instruction % 100; // Rightmost 2 digits are op code
            let paramModes = parseInt(Math.floor(instruction / 100).toString(), 2);
            let paramMode = [paramModes & 1, paramModes>>1 & 1, paramModes>>2 & 1];
            let paramPos = paramMode.map((mode, index) => ( mode ? pos + index + 1 : program[pos + index + 1] ));
    
            // console.debug('Step', pos, [arr[pos], arr[pos+1], arr[pos+2], arr[pos+3], arr[pos+4]].slice(0, paramCount[opcode] + 1));
    
            switch (opcode) {
                case 1:
                    program[paramPos[2]] = program[paramPos[0]] + program[paramPos[1]];
                    console.debug('Add', program[paramPos[2]], 'to', paramPos[2]);
                    pos += paramCount[opcode] + 1;
                break;
                case 2:
                    program[paramPos[2]] = program[paramPos[0]] * program[paramPos[1]];
                    console.debug('Multiply', program[paramPos[2]], 'to', paramPos[2]);
                    pos += paramCount[opcode] + 1;
                break;
                case 3:
                    let userInput = userInputs.shift();
                    program[paramPos[0]] = userInput;
                    console.log(id, 'Input', program[paramPos[2]], 'to', paramPos[2]);
                    pos += paramCount[opcode] + 1;
                break;
                case 4:
                    console.log(id, 'OUTPUT', program[paramPos[0]], ' from ', paramPos[0]);
                    lastOutput = program[paramPos[0]];
                    pos += paramCount[opcode] + 1;
                    return { output: lastOutput, end: false };
                break;
                case 5:
                    console.debug('JumpIfTrue', program[paramPos[0]]);
                    if (program[paramPos[0]]) {
                        pos = program[paramPos[1]];
                    } else {
                        pos += paramCount[opcode] + 1;
                    }
                break;
                case 6:
                    console.debug('JumpIfFalse', program[paramPos[0]]);
                    if (!program[paramPos[0]]) {
                        pos = program[paramPos[1]];
                    } else {
                        pos += paramCount[opcode] + 1;
                    }
                break;
                case 7:
                    console.debug('LessThan', program[paramPos[0]], program[paramPos[1]]);
                    if (program[paramPos[0]] < program[paramPos[1]]) {
                        program[paramPos[2]] = 1;
                    } else {
                        program[paramPos[2]] = 0;
                    }
                    pos += paramCount[opcode] + 1;
                break;
                case 8:
                    console.debug('Equals', program[paramPos[0]], program[paramPos[1]]);
                    if (program[paramPos[0]] == program[paramPos[1]]) {
                        program[paramPos[2]] = 1;
                    } else {
                        program[paramPos[2]] = 0;
                    }
                    pos += paramCount[opcode] + 1;
                break;
                case 99:
                    console.log(id, 'Final:', ['after', prevOpcode]);
                    return { output: lastOutput, end: true };
                default:
                    console.error('Unimplemented opcode', opcode);
            }
            prevOpcode = opcode;
        }
        console.error('Error: out of index', pos);
    }
    
    return {
        run
    }
};

const permutator = (inputArr) => {
    let result = [];
  
    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
  
   return result;
}

const solveForSequence = (program, sequence) => {
    let maxOutput = {'value': -Infinity};
    let phases = [...sequence];
    let programs = {};
    let prevReturn = { output: 0, end: false };
    let lastOutput = 0;

    while (phase = phases.shift()) {
        if (!(phase in programs)) {
            programs[phase] = Intcpu(`phase${phase}`, program);
            prevReturn = programs[phase].run([phase, prevReturn.output]);
        } else {
            prevReturn = programs[phase].run([prevReturn.output]);
        }

        if (prevReturn.end) {
            return lastOutput;
        }

        lastOutput = prevReturn.output;

        if (!phases.length) {
            phases = [...sequence];
        }
    }

    return maxOutput.value;
};

const solve = (program) => {
    let max = -Infinity;
    let sequences = permutator([9,8,7,6,5]);
    // console.log(sequences)

    for (let sequence of sequences) {
        res = solveForSequence(program, sequence);
        if (res > max) {
            max = res;
        }
    }
    return max;
}


let test = `3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`;
console.log(solve(test, [9,8,7,6,5]), 'expected:', 139629729);

// test = `3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`;
// console.log(solve(test, [9,7,8,5,6]), 'expected:', 18216);


let input = `3,8,1001,8,10,8,105,1,0,0,21,34,51,76,101,126,207,288,369,450,99999,3,9,102,4,9,9,1001,9,2,9,4,9,99,3,9,1001,9,2,9,1002,9,3,9,101,3,9,9,4,9,99,3,9,102,5,9,9,1001,9,2,9,102,2,9,9,101,3,9,9,1002,9,2,9,4,9,99,3,9,101,5,9,9,102,5,9,9,1001,9,2,9,102,3,9,9,1001,9,3,9,4,9,99,3,9,101,2,9,9,1002,9,5,9,1001,9,5,9,1002,9,4,9,101,5,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99`;
console.log(solve(input));