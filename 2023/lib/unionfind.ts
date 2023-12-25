export class UnionFind {
    private parent: number[];
    private rank: number[];

    constructor(length: number) {
        this.parent = Array.from({ length }, (_, k) => k);
        this.rank = Array.from({ length }, () => 0);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }

    union(x: number, y: number): void {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX !== rootY) {
            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
        }
    }

    connected(x: number, y: number): boolean {
        return this.find(x) === this.find(y);
    }
}

// const uf = new UnionFind(10);
// uf.union(1, 2);
// console.log(uf.connected(1, 2)); // true
// console.log(uf.connected(1, 3)); // false