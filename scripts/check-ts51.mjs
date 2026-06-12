/**
 * Проверяет, что весь код в registry/ компилируется TypeScript 5.1 —
 * версией, которая стоит у продуктов-консьюмеров (5.1.5).
 * Использует devDependency-алиас "typescript-5.1" (npm:typescript@5.1.6).
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { glob } from "node:fs/promises";

const require = createRequire(import.meta.url);
const ts = require("typescript-5.1");

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const files = [];
for await (const file of glob("registry/**/*.{ts,tsx}", { cwd: rootDir })) {
  files.push(path.join(rootDir, file));
}

if (files.length === 0) {
  console.error("No files found in registry/ — nothing to check.");
  process.exit(1);
}

const program = ts.createProgram(files, {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  esModuleInterop: true,
  isolatedModules: true,
  lib: ["lib.es2020.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
  baseUrl: rootDir,
  paths: {
    "@/lib/utils": ["./registry/default/lib/utils.ts"],
    "@/components/ui/*": ["./registry/default/ui/*"],
    "@/components/icons": ["./registry/default/icons/index.ts"],
    "@/hooks/*": ["./registry/default/hooks/*"],
    "@/*": ["./*"],
  },
});

const diagnostics = ts.getPreEmitDiagnostics(program);

if (diagnostics.length > 0) {
  const host = {
    getCurrentDirectory: () => rootDir,
    getCanonicalFileName: (f) => f,
    getNewLine: () => "\n",
  };
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, host));
  console.error(
    `\n✖ ${diagnostics.length} error(s) under TypeScript ${ts.version}. ` +
      "Код registry/ обязан компилироваться TS 5.1 (стек консьюмеров).",
  );
  process.exit(1);
}

console.log(
  `✔ registry/ (${files.length} files) компилируется TypeScript ${ts.version} без ошибок.`,
);
