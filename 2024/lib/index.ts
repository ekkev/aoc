export { File } from "./file.ts";

import { protosArray } from "./array.ts";
import { protosString } from "./string.ts";

export const globalProtos = () => {
    protosArray();
    protosString();
}