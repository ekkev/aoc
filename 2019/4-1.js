let low = 156218;
let high = 652527;

let count = 0;

const isPassword = numr => {
    let i = numr.toString().split('').map(t => parseInt(t, 10));
    return (i[0] <= i[1] && i[1] <= i[2] && i[2] <= i[3] && i[3] <= i[4] && i[4] <= i[5]
        && ((i[0] == i[1] && i[1] != i[2])
            ||  (i[1] == i[2] && i[0] != i[1] && i[2] != i[3])
            ||  (i[2] == i[3] && i[1] != i[2] && i[3] != i[4])
            ||  (i[3] == i[4] && i[2] != i[3] && i[4] != i[5])
            ||  (i[4] == i[5] && i[3] != i[4])
        ));
};

for (let i = low; i<=high; i++){
    if (isPassword(i)) {
        count++;
    }
}

console.log(count);