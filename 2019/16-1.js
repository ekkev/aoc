const solve = (input, iterations) => {
    const basePattern = [0, 1, 0, -1];
    let signal = input.split('').map(v => parseInt(v, 10));
    let newSignal = [];
    for (let iteration = 1; iteration <= iterations; iteration++) {
        for (let pos = 1; pos <= signal.length; pos++) {
            let posPattern = basePattern.map(i => Array(pos).fill(i)).reduce((a, b) => a.concat(b), [])
            while (posPattern.length < signal.length+1) {
                posPattern = posPattern.concat(posPattern);
            }
            posPattern = posPattern.slice(1);
            let posValue = Math.abs(signal.map((value, i) => value * posPattern[i]).reduce((a,b) => a+b)) % 10;
            newSignal.push(posValue);
        }
        signal = [...newSignal];
        newSignal = [];
    }
    return signal.slice(0, 8).join('')
}

test = `12345678`;
console.log(solve(test, 4), '01029498');

test = `80871224585914546619083218645595`;
console.log(solve(test, 100), 24176176);

test = `19617804207202209144916044189917`;
console.log(solve(test, 100), 73745418);

test = `69317163492948606335995924319873`;
console.log(solve(test, 100), 52432133);

test = `59772698208671263608240764571860866740121164692713197043172876418614411671204569068438371694198033241854293277505547521082227127768000396875825588514931816469636073669086528579846568167984238468847424310692809356588283194938312247006770713872391449523616600709476337381408155057994717671310487116607321731472193054148383351831456193884046899113727301389297433553956552888308567897333657138353770191097676986516493304731239036959591922009371079393026332649558536888902303554797360691183681625604439250088062481052510016157472847289467410561025668637527408406615316940050060474260802000437356279910335624476330375485351373298491579364732029523664108987`;
console.log(solve(test, 100), 68764632);
