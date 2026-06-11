/**
 * Генерирует React-компоненты иконок Lantern.
 *
 * Входы:  tokens/icon-pool.json  (имена и node id из Figma)
 *         tokens/svg/*.svg       (выгруженные из Figma кастомные иконки)
 * Выходы: registry/default/icons/lucide.ts        (re-export проверенных lucide-имён)
 *         registry/default/icons/custom/*.tsx      (кастомные компоненты из SVG)
 *         registry/default/icons/index.ts          (баррель)
 *
 * Правила: forwardRef (React 18), fill=currentColor, проп size (по умолчанию 16).
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const lucide = require("lucide-react");

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svgDir = path.join(rootDir, "tokens/svg");
const outDir = path.join(rootDir, "registry/default/icons");
const customDir = path.join(outDir, "custom");

const pool = JSON.parse(readFileSync(path.join(rootDir, "tokens/icon-pool.json"), "utf8"));

const toPascal = (name) =>
  name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

// --- 1. Валидация пула против lucide-react ---------------------------------

const svgFiles = new Set(readdirSync(svgDir).filter((f) => f.endsWith(".svg")).map((f) => f.replace(/\.svg$/, "")));

const aliases = Object.entries(pool.aliases ?? {}).filter(([k]) => !k.startsWith("$"));
for (const [figmaName, lucideName] of aliases) {
  if (!lucide[lucideName]) {
    throw new Error(`Алиас "${figmaName}" -> "${lucideName}": такого экспорта нет в lucide-react.`);
  }
}
const aliasMap = Object.fromEntries(aliases);

const lucideExports = [];
const missingEverywhere = [];
for (const name of Object.keys(pool.icons)) {
  if (aliasMap[name]) continue; // обработаем отдельной секцией алиасов
  const pascal = toPascal(name);
  if (lucide[pascal]) {
    lucideExports.push(pascal);
  } else if (!svgFiles.has(name)) {
    missingEverywhere.push(name);
  }
}
if (missingEverywhere.length > 0) {
  throw new Error(
    `Иконки не найдены ни в lucide-react, ни в tokens/svg/: ${missingEverywhere.join(", ")}. ` +
      "Выгрузите их SVG из Figma или поправьте имя в tokens/icon-pool.json.",
  );
}

// --- 2. Генерация кастомных компонентов из SVG -------------------------------

function jsxifyAttributes(markup) {
  return markup.replace(/([a-z]+)-([a-z])([a-z]*)=/g, (m, a, b, c) => `${a}${b.toUpperCase()}${c}=`);
}

function extractIconMarkup(svgText, iconName) {
  const groupStart = svgText.indexOf(`<g id="${iconName}"`);
  if (groupStart === -1) {
    throw new Error(`В SVG "${iconName}" нет группы <g id="${iconName}"> — проверь экспорт.`);
  }
  // Берём содержимое группы с учётом вложенных <g>
  let depth = 0;
  let i = groupStart;
  let end = -1;
  while (i < svgText.length) {
    const open = svgText.indexOf("<g", i);
    const close = svgText.indexOf("</g>", i);
    if (close === -1) break;
    if (open !== -1 && open < close) {
      depth += 1;
      i = open + 2;
    } else {
      depth -= 1;
      i = close + 4;
      if (depth === 0) {
        end = close;
        break;
      }
    }
  }
  if (end === -1) throw new Error(`Не удалось найти конец группы в "${iconName}".`);
  const inner = svgText.slice(svgText.indexOf(">", groupStart) + 1, end);
  return jsxifyAttributes(
    inner
      .replace(/\s*id="[^"]*"/g, "")
      .replace(/fill="#[0-9a-fA-F]{3,8}"/g, 'fill="currentColor"')
      .replace(/stroke="#[0-9a-fA-F]{3,8}"/g, 'stroke="currentColor"')
      .replace(/<g>\s*<\/g>/g, "")
      .trim(),
  );
}

mkdirSync(customDir, { recursive: true });

const customComponents = [];
const allCustomNames = [
  ...Object.keys(pool.semantic),
  ...Object.keys(pool.icons).filter((n) => !aliasMap[n] && !lucide[toPascal(n)]),
];

for (const name of allCustomNames) {
  const svgPath = path.join(svgDir, `${name}.svg`);
  const svgText = readFileSync(svgPath, "utf8");
  const viewBoxMatch = svgText.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 16 16";
  const markup = extractIconMarkup(svgText, name);
  const componentName = `${toPascal(name)}Icon`;

  const indentedMarkup = markup
    .split("\n")
    .map((line) => `      ${line.trim()}`)
    .join("\n");

  const source = `import * as React from "react";
import type { LanternIconProps } from "../types";

export const ${componentName} = React.forwardRef<SVGSVGElement, LanternIconProps>(
  ({ size = 16, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="${viewBox}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
${indentedMarkup}
    </svg>
  ),
);
${componentName}.displayName = "${componentName}";
`;
  writeFileSync(path.join(customDir, `${name}.tsx`), source);
  customComponents.push({ name, componentName });
}

// --- 3. types.ts -------------------------------------------------------------

writeFileSync(
  path.join(outDir, "types.ts"),
  `import type * as React from "react";

export interface LanternIconProps extends React.SVGProps<SVGSVGElement> {
  /** Width and height in px. Lantern icons are drawn on a 16px grid. */
  size?: number | string;
}
`,
);

// --- 4. lucide.ts (re-exports) ------------------------------------------------

lucideExports.sort();
const aliasLines = aliases
  .map(([figmaName, lucideName]) => `export { ${lucideName} as ${toPascal(figmaName)} } from "lucide-react";`)
  .join("\n");
writeFileSync(
  path.join(outDir, "lucide.ts"),
  `// Generated by scripts/generate-icons.mjs — do not edit by hand.
// Lucide icons used by the Lantern design system (Figma: Lantern-Lucide-Icons, "icons pool").
export {
${lucideExports.map((n) => `  ${n},`).join("\n")}
} from "lucide-react";

// Figma names that map to differently-named Lucide glyphs.
${aliasLines}
`,
);

// --- 5. index.ts (баррель) -----------------------------------------------------

customComponents.sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(
  path.join(outDir, "index.ts"),
  `// Generated by scripts/generate-icons.mjs — do not edit by hand.
export type { LanternIconProps } from "./types";
export * from "./lucide";
${customComponents.map((c) => `export { ${c.componentName} } from "./custom/${c.name}";`).join("\n")}
`,
);

// --- 6. registry.json: item "icons" -------------------------------------------

const registryPath = path.join(rootDir, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const iconFiles = [
  "registry/default/icons/index.ts",
  "registry/default/icons/types.ts",
  "registry/default/icons/lucide.ts",
  ...customComponents.map((c) => `registry/default/icons/custom/${c.name}.tsx`),
].map((p) => ({
  path: p,
  type: "registry:ui",
  target: p.replace("registry/default/icons/", "components/icons/"),
}));

const iconsItem = {
  name: "icons",
  type: "registry:ui",
  title: "Icons",
  description:
    "The Lantern icon set: product icons exported from Figma plus the curated Lucide subset re-exported from lucide-react.",
  dependencies: ["lucide-react"],
  files: iconFiles,
};

const existingIndex = registry.items.findIndex((item) => item.name === "icons");
if (existingIndex === -1) {
  registry.items.push(iconsItem);
} else {
  registry.items[existingIndex] = iconsItem;
}
writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

console.log(`✔ lucide re-exports: ${lucideExports.length} (+${aliases.length} aliases)`);
console.log(`✔ custom components: ${customComponents.length} (${customComponents.map((c) => c.componentName).join(", ")})`);
console.log(`✔ registry.json: item "icons" with ${iconFiles.length} files`);
