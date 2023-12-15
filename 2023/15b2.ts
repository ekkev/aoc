console.log(
    new TextDecoder('ascii').decode(Deno.readFileSync('15.in'))
    .split(',')
    .map(it => it.split(/([=-])/))
    .map(arr => [...arr, 1 + arr[0].split('').map(c => c.charCodeAt(0)).reduce((prev, ascii) => (prev + ascii) * 17 % 256, 0)] as [string, string, string, number]) 
    .reduce((boxes, [code, op, num, bi]) => 
        boxes.with(bi, (box => box.toSpliced(
            box.some(([codeInABox]) => codeInABox === code) ? box.findIndex(([codeInABox]) => codeInABox === code) : box.length,
            1, ...(op === '=' ? [[code, num]] as typeof box : [])))(boxes[bi])),
        Array.from({ length: 257 }, () => [] as [string, string][]))
    .map((box, bi) => box.map(([_code, num], pos) => +num * ++pos * bi))
    .flat()
    .reduce((p, v) => p + v)
);
// 265462 // silly one-liner edition