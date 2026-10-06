import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const destDir = join(
  process.cwd(),
  ".vercel/output/functions/__server.func/_libs",
);
if (!existsSync(destDir)) process.exit(0);
const srcDir = join(process.cwd(), "node_modules/@electric-sql/pglite/dist");
for (const name of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  copyFileSync(join(srcDir, name), join(destDir, name));
}
