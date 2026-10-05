import { writeFileSync } from "node:fs";

// The root package is "type": "module"; the cjs build output must declare the
// opposite so `require("@gruia/feedback")` works for CJS consumers (jest, tsc
// server builds).
writeFileSync(new URL("../dist/cjs/package.json", import.meta.url), JSON.stringify({ type: "commonjs" }) + "\n");
