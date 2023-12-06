import { lineByLine } from './file'

// Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?
async function solve () {
    const MAX_SIZE = 100000;
    const FS_DISK_SIZE  = 70000000;
    const UNUSED_NEEDED = 30000000;

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

    const MIN_TO_DELETE = dirSize['//'] - (FS_DISK_SIZE - UNUSED_NEEDED)
    console.log(dirSize, MIN_TO_DELETE)
    return Object.values(dirSize).filter(size => size >= MIN_TO_DELETE).sort((a,b) => a-b)[0]
    

}

solve().then(console.log)