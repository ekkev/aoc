import { rangeInclusive } from "./lib/array.ts";
import { File, globalProtos } from "./lib/index.ts";
globalProtos();

const changePriceForAllBuyers = new Map<string, number>(); 

File.numberList("22.in").forEach(num => {
    const seenChanges = new Map<string, number>();
    const last4changes: number[] = [];
    rangeInclusive(1, 2000).reduce((secret) => {
        const prevPrice = Number(secret.toString().at(-1));
        secret = (secret ^ (secret * 64n)) % 16777216n;
        secret = (secret ^ (secret / 32n)) % 16777216n;
        secret = (secret ^ (secret * 2048n)) % 16777216n;

        const price = Number(secret.toString().at(-1));
        last4changes.push(price - prevPrice);

        if (last4changes.length === 4) {
            const key = last4changes.join();
            if (!seenChanges.has(key)) {
                seenChanges.set(key, price);
                changePriceForAllBuyers.set(key, price + (changePriceForAllBuyers.get(key) ?? 0));
            }
            last4changes.shift();
        }
        return secret;
    }, BigInt(num))
});

console.log({ res: Math.max(...changePriceForAllBuyers.values()) }); // 2223