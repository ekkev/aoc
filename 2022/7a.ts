import { lineByLine } from './file'

// Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?
async function solve () {
    const MAX_SIZE = 100000;
    let currentPath: string[] = [];
    let files: Record<string, number> = {};
    let dirSize: Record<string, number> = {};

    for await (const line of await lineByLine('7.in')) {
        let m: RegExpMatchArray | null;
        if (m = line.match(/^\$ cd (?<path>.*)$/)) {
            if (typeof m.groups?.path === 'undefined') {
                throw new Error(`No groups in ${line}`)
            }

            if (m.groups.path == '..') {
                currentPath.pop();
            } else {
                currentPath.push(m.groups.path)
            }
            continue;
        }

        if (m = line.match(/^(?<size>\d+) (?<file>.*)$/)) {
            if (typeof m.groups?.size === 'undefined' || typeof m.groups?.file === 'undefined') {
                throw new Error(`No groups in ${line}`)
            }

            const size = parseInt(m.groups.size, 10);
            let parentPath = '';
            currentPath.forEach(dir => {
                parentPath += `/${dir}`;
                dirSize[parentPath] = (dirSize[parentPath] ?? 0) + size;
            })
            // files[[...currentPath, m.groups.file].join('/')] = size;
            continue;
        }
    }

    console.log(dirSize)
    return Object.values(dirSize).filter(size => size <= MAX_SIZE).reduce((sum, val) => sum + val, 0)

}

solve().then(console.log)