/**
 * Генерирует CSS-переменные темы Lantern из экспорта Token Studio.
 *
 * Входы:  tokens/lantern-tokens.json (экспорт из Figma через Token Studio)
 *         tokens/mapping.json        (таблица соответствий, сверена вручную)
 * Выходы: src/index.css              (блок между маркерами LANTERN-TOKENS)
 *         registry.json              (cssVars у item "theme-lantern")
 *
 * Формат значений: HSL-каналы без обёртки hsl() — конвенция shadcn для Tailwind v3.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(path.join(rootDir, p), "utf8"));

const tokens = read("tokens/lantern-tokens.json");
const mapping = read("tokens/mapping.json");

// --- Token Studio helpers -------------------------------------------------

function flatten(obj, prefix = "") {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object" && "$value" in value) {
      out[prefix + key] = value.$value;
    } else if (value && typeof value === "object" && !key.startsWith("$")) {
      Object.assign(out, flatten(value, `${prefix}${key}/`));
    }
  }
  return out;
}

const rawColors = flatten(tokens[mapping.rawColors]);
const semantic = flatten(tokens[mapping.mode]);

function resolveValue(value, depth = 0) {
  if (typeof value !== "string" || depth > 5) return value;
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;
  const tokenPath = match[1].replace(/\./g, "/");
  const next = rawColors[tokenPath] ?? semantic[tokenPath];
  if (next === undefined) {
    throw new Error(`Не удалось разрезолвить ссылку токена: ${value}`);
  }
  return resolveValue(next, depth + 1);
}

// --- hex -> "H S% L%" (каналы HSL без обёртки) ------------------------------

function hexToHslChannels(hex) {
  const normalized = hex.replace("#", "");
  if (normalized.length === 8) {
    throw new Error(
      `Токен с альфа-каналом (${hex}) нельзя положить в hsl(var(--x)) — нужен отдельный маппинг.`,
    );
  }
  if (normalized.length !== 6) {
    throw new Error(`Неожиданный формат цвета: ${hex}`);
  }
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }

  const round1 = (n) => Math.round(n * 10) / 10;
  return `${round1(h * 360)} ${round1(s * 100)}% ${round1(l * 100)}%`;
}

// --- Сборка переменных ------------------------------------------------------

const cssVars = {};
for (const [slot, spec] of Object.entries(mapping.light)) {
  const tokenPath = typeof spec === "string" ? spec : spec.token;
  const rawValue = semantic[tokenPath];
  if (rawValue === undefined) {
    throw new Error(`Токен "${tokenPath}" (слот --${slot}) не найден в режиме "${mapping.mode}".`);
  }
  cssVars[slot] = hexToHslChannels(resolveValue(rawValue));
}
cssVars.radius = mapping.radius;

// --- src/index.css ----------------------------------------------------------

const cssLines = Object.entries(cssVars)
  .map(([name, value]) => `    --${name}: ${value};`)
  .join("\n");

const cssBlock = [
  "/* LANTERN-TOKENS:START — сгенерировано scripts/sync-tokens.mjs, не редактировать вручную.",
  ` * Источник: tokens/lantern-tokens.json, режим "${mapping.mode}", маппинг tokens/mapping.json.`,
  " * Тёмной темы у Lantern пока нет (решение 2026-06-11). */",
  "@layer base {",
  "  :root {",
  cssLines,
  "  }",
  "}",
  "/* LANTERN-TOKENS:END */",
].join("\n");

const cssPath = path.join(rootDir, "src/index.css");
const css = readFileSync(cssPath, "utf8");
const markerRe = /\/\* LANTERN-TOKENS:START[\s\S]*?LANTERN-TOKENS:END \*\//;
if (!markerRe.test(css)) {
  throw new Error("В src/index.css нет маркеров LANTERN-TOKENS:START/END.");
}
writeFileSync(cssPath, css.replace(markerRe, cssBlock));

// --- registry.json (cssVars у theme-lantern) ---------------------------------

const registryPath = path.join(rootDir, "registry.json");
const registry = read("registry.json");
const themeItem = registry.items.find((item) => item.name === "theme-lantern");
if (!themeItem) {
  throw new Error('В registry.json нет item "theme-lantern".');
}
themeItem.cssVars = { light: cssVars };
writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);

console.log(`✔ ${Object.keys(cssVars).length} переменных записано в src/index.css и registry.json:`);
for (const [name, value] of Object.entries(cssVars)) {
  console.log(`   --${name}: ${value}`);
}
