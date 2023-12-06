import { readAllLines } from "./lib/file.ts";

type Op = '+'|'-'|'*'|'/';
const ops: Record<Op, (a: number, b: number) => number> = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
}
const inverseOp: Record<Op, Op> = {
   '-': '+',
   '+': '-',
   '*': '/',
   '/': '*'
}

type Node = {
   name: string,
   humnSide?: boolean,
   left: string,
   op: Op,
   right: string,
}; 

const all = readAllLines('21.in').map(v => v.split(': ') as [string, string]);
const values = new Map(all.filter(([k, v]) => v.match(/^\d+$/)).map(([k, v]) => [k, Number(v)] as [string, number]));
const nodes: Record<string, Node> = Object.fromEntries(
   all.map(([k, v]) => [k, v.split(' ') as [string, Op, string]])
   .map(([name, [left, op, right]]) => [name, {
      name,
      left,
      op,
      right,
   }]));


const traverse = (name: string): undefined | [number, string] => {
   const node = nodes[name];
   if (node.name === 'humn')
      node.humnSide = true;

   if (values.has(name))
      return;

   traverse(node.left);
   traverse(node.right);

   const left = nodes[node.left];
   const right = nodes[node.right];

   if (left.humnSide || right.humnSide)
      node.humnSide = true;

   const lv = values.get(left.name)!;
   const rv = values.get(right.name)!;
   values.set(name, ops[node.op!](lv, rv));

   if (node.name === 'root')
      return (left.humnSide ? [rv, left.name] : [lv, right.name]) as [number, string];
}


const findHumnValue = (name: string, target: number): number => {
   if (name === 'humn')
      return target;

   const { op, left, right } = nodes[name];

   const humnSideOnRight = nodes[right].humnSide;
   const humnName        = humnSideOnRight ? right : left;
   const otherValue      = values.get(humnSideOnRight ? left : right)!;

   // a = b + c, b = a - c, c = a - b
   // a = b - c, b = a + c, c = b - a <<
   // a = b * c, b = a / c, c = a / b 
   // a = b / c, b = a * c, c = b / a <<
   if (['-', '/'].includes(op) && humnSideOnRight) {
      return findHumnValue(humnName, ops[op](otherValue, target));
   } else { 
      return findHumnValue(humnName, ops[inverseOp[op]](target, otherValue));
   }
}


const [rootEqualityValue, rootEqualityKey] = traverse('root') as [number, string];

// Run through the side of equations which lead to 'humn', recalculating values in reverse
const result = findHumnValue(rootEqualityKey, rootEqualityValue);

console.log({rootEqualityValue, rootEqualityKey, result});
// { rootEqualityKey: "bzrn", rootEqualityValue: 3952741911612, result: 3882224466191 }