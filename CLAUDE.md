# Lantern Design System

Дизайн-система Lantern: Figma-дизайн (на базе Obra shadcn/ui) переводится в React-компоненты, публикуется в Storybook (Chromatic) и распространяется через собственный shadcn registry.

## Критические правила совместимости

Консьюмеры (продукты компании): **React 18.3.1, TypeScript 5.1.5, Tailwind CSS 3.4 (v3!), Vite 6, shadcn style "default"**. Поэтому:

1. **Всегда `React.forwardRef`** в компонентах. НЕ использовать паттерн React 19 (`ref` как обычный проп) — под React 18 он молча ломается.
2. **Без синтаксиса TS ≥ 5.2** в `registry/**` (никаких `using` и т.п.). Проверка: `npm run check:ts51`.
3. **Токены — HSL-каналы без обёртки**: `--primary: 222.2 47.4% 11.2%`; в классах `hsl(var(--primary))`. Никакого oklch / Tailwind v4 `@theme`.
4. **Только `registry:ui` / `registry:theme` / `registry:lib`** — никаких `registry:page` (консьюмеры на react-router v5).
5. **Файлы в `registry/` самодостаточны**: зависят только от npm-пакетов, `@/lib/utils` и `registryDependencies`. Stories импортируют ИЗ `registry/`, никогда наоборот.
6. tailwind-merge остаётся на **v2** (v3 — для Tailwind 4).

## Язык

Весь видимый разработчикам контент — **только на английском**: тексты в Storybook (stories, MDX, примеры), описания registry-items, README-инструкции для потребителей, демо-страница. Русский допустим во внутренних доках (CLAUDE.md, комментарии в скриптах, mapping.json).

## Перевод токенов Figma → Tailwind

Шпаргалка ниже покрывает 90% случаев — сверяйся с ней до похода в Figma. Полный
источник истины для алиасов Figma-имя → shadcn-слот — `tokens/mapping.json`; значения
токенов — `registry.json` (item `theme-lantern`) / `src/index.css`.

### Цвета — только семантические токены (hex не хардкодить)

| Figma переменная               | Tailwind (`text-`/`bg-`/`border-`)        | HSL-токен                       | hex      |
|--------------------------------|-------------------------------------------|---------------------------------|----------|
| general/background             | `bg-background`, `bg-card`, `bg-popover`  | `--background` 0 0% 100%        | `#ffffff`|
| general/foreground             | `text-foreground` (`--card/popover-foreground` тоже) | `--foreground` 0 0% 3.9% | `#0a0a0a`|
| general/secondary foreground   | `text-secondary-foreground`               | `--secondary-foreground` 0 0% 9%| `#171717`|
| general/muted foreground       | `text-muted-foreground`                   | `--muted-foreground` 0 0% 45.1% | `#737373`|
| general/border                 | `border-border` (= `--input`, `--ring` рядом) | `--border` 0 0% 89.8%       | `#e5e5e5`|
| muted / secondary (поверхность)| `bg-muted`, `bg-secondary`                | 0 0% 96.1%                      | `#f5f5f5`|
| primary (бренд-violet)         | `bg-primary` / `text-primary-foreground`  | `--primary` 258.8 63.3% 59.4%   | —        |
| accent (светлый violet)        | `bg-accent` / `text-accent-foreground`    | `--accent` 267.7 95.1% 92%      | —        |
| destructive                    | `bg-destructive` / `text-destructive`     | `--destructive` 0 72.2% 50.6%   | ~`#dc2626`|
| tooltip (чёрный)               | `bg-tooltip` / `text-tooltip-foreground`  | `--tooltip` 0 0% 0%             | `#000000`|
| sidebar/*                      | `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`… | `--sidebar*` | (см. theme) |

- **Чипы/бейджи — сырые Tailwind-шкалы** (как в сайдбаре и app-card): `bg-lime-100`/`bg-cyan-100`/`bg-blue-100`/`bg-gray-100`/`bg-orange-100`/`bg-yellow-100`, точка статуса `bg-lime-500`. Бренд-violet — кастомная шкала из theme (`violet-50…950`). Figma `lime/100` = tw `lime-100` точно; Figma `Gray/100` #f2f4f7 ≈ tw `gray-100` #f3f4f6.
- Если цвета нет ни в токенах, ни в шкалах (или он помечен `unofficial/*`) — **спросить дизайнера**, какой это токен.

### Spacing — px ÷ 4 = Tailwind-единица

Figma spacing-токены: `3xs`=2→`0.5`, `2xs`=4→`1`, `xs`=8→`2`, `sm`=12→`3`, `md`=16→`4`, дальше `px/4`. Применять как `p-*`/`gap-*`/`px-*`/`py-*`. Shadows совпадают со шкалой (`shadow-*`).

### Радиусы (имена Figma сдвинуты, но px совпадают с Tailwind)

figma `rounded-xs`=2=tw `rounded-sm`, `rounded-sm`=4=tw `rounded`, `rounded-md`=6=tw `rounded-md`, `rounded-lg`=8=tw `rounded-lg`, `rounded-xl`=12=tw `rounded-xl`, `rounded-full`=9999=tw `rounded-full`. Компонентный токен `radius`=10px → `--radius`. Всегда сверяйся со значением в px.

### Типографика (Inter)

heading 1 → `text-5xl leading-none font-semibold tracking-[-1.5px]`, heading 2 → `text-3xl leading-none font-semibold tracking-[-1px]`, heading 3 → `text-2xl font-semibold tracking-[-1px]`, heading 4 → `text-xl leading-6 font-semibold`, параграфы large/regular/small/mini → `text-lg`/`text-base`/`text-sm`/`text-xs`. Частые: paragraph small = `text-sm leading-5` (14/20), paragraph mini = `text-xs leading-4` (12/16); medium-вес = `font-medium`, regular = `font-normal`.

**ПРАВИЛО (от Alex, 2026-06-12): каждый видимый элемент обязан быть явно привязан к токену** — цвет, размер, типографика, скругление. Никогда не полагаться на случайные дефолты (например, дефолтный размер lucide-иконки 24px) или на наследование, которое может сломаться при перемещении элемента. После любого изменения вёрстки — проходить по всем затронутым элементам и сверять с токенами дизайна. Один и тот же тип элемента (пункт меню, имя агента) везде выглядит одинаково, без точечных переопределений в местах использования.

## Иконки — индекс

Набор живёт в `registry/default/icons/` (генератор — `scripts/generate-icons.mjs`):
- `lucide.ts` — точные имена Lucide, ре-экспорт из `lucide-react`.
- `custom/*.tsx` — продуктовые глифы (forwardRef, `currentColor`, `size` по умолчанию 16): Accounts, AdLibrary, Agents, Apps, Assets, Calculator, Contacts, Data, History, House, Ideas, LanternLogo, Linkedin, NewAgent, Overview, PinnedTabs, Sequencing, SkillsLibrary, Views, Visualize, Workflow.
- `index.ts` — общий barrel.

**Импорт:** в registry-компонентах — напрямую из `lucide-react` (и `lucide-react` в `dependencies` item-а); в stories — из `@/registry/default/icons`.

**Прежде чем опознавать иконку через Figma — grep по `lucide.ts`/`index.ts`.** Имя в Figma обычно совпадает с именем Lucide. Известные несовпадения и недавно подтверждённые глифы:

| Figma / назначение        | Наш экспорт                               |
|---------------------------|-------------------------------------------|
| open-external-link        | `OpenExternalLink` (= `SquareArrowOutUpRight`) |
| drag-up-down              | `DragUpDown` (= `TextAlignJustify`)       |
| sources (app-card)        | `Atom`                                    |
| pinned (app-card)         | `Pin`                                     |
| more / контекст-меню      | `Ellipsis`                                |
| статус-точка              | не иконка — кружок `size-2 rounded-full bg-lime-500` |

Если глифа нет в наборе и имя неочевидно: скачать SVG-ассет из ответа `get_design_context` и отрендерить локально (`qlmanage -t -s 240 -o . icon.svg`) либо сопоставить по внутреннему `<g id="...">` — без серии скриншотов из Figma. Новые продуктовые иконки (которых нет в Lucide) добавляются в `tokens/icon-pool.json` + `tokens/svg/` и генерятся скриптом.

## Структура

- `registry/default/ui/<name>.tsx` — компоненты, плоские файлы (forwardRef + CVA-варианты). Импорты между компонентами — консьюмерские пути (`@/components/ui/<name>`, `@/hooks/<name>`, `@/lib/utils`), алиасы настроены в tsconfig/vite/check-ts51
- `registry/default/hooks/<name>.ts` — хуки (registry:hook)
- `registry/default/lib/utils.ts` — `cn()`
- `registry/default/theme/` — токены (Фаза 2)
- `registry.json` — манифест registry; каждый новый компонент добавляется сюда
- `public/r/` — вывод `npm run registry:build` (коммитится, его раздаёт Vercel)
- `stories/` — Storybook stories (`ui/`, `foundations/`, `icons/`)
- `fixtures/consumer-v3/` — фикстура-консьюмер для e2e-проверки установки
- `scripts/` — `check-ts51.mjs`, `sync-tokens.ts` (Фаза 2), `generate-icons.ts` (Фаза 3)

## Воркфлоу: новый компонент из Figma

1. Получить от дизайнера ссылку на Figma-компонент.
2. `get_design_context` + `get_screenshot` (+ `get_variable_defs` при необходимости) через Figma MCP.
3. За основу взять соответствующий компонент shadcn/ui (старый default-style, forwardRef-паттерн), адаптировать под дизайн Lantern: варианты → CVA, цвета/радиусы → только токены (`bg-primary`, `rounded-md`...), без хардкода hex.
4. Story в `stories/ui/<name>.stories.tsx`: все варианты, размеры, состояния (disabled, loading...), light/dark через тулбар.
5. Добавить item в `registry.json` (`registryDependencies: ["@lantern/utils", ...]`, npm-зависимости — например `@radix-ui/react-*` — в `dependencies`).
6. `npm run registry:build && npm run check:ts51 && npm run build-storybook`.
7. Сверить рендер в Storybook со скриншотом из Figma.
7a. **Регрессия после правок**: у компонента в шапке story-файла ведётся список принятых на ревью решений — после любой правки пройтись по нему целиком и замерить геометрию (getBoundingClientRect через playwright) в обоих/всех состояниях. Не пушить, пока чек-лист не зелёный.
8. E2e (опционально локально — CI делает это на PR): поднять `npx serve public -l 8080`, в фикстуре `npx shadcn@latest add @lantern/<name> --yes --overwrite`, затем `npm run build` в фикстуре.
9. **Разработка в feature-ветке, не в `main`.** Вся итерация — локально (`npm run storybook` + проверки из п.6, замеры Playwright). Когда готово к ревью: `git push` ветки + `gh pr create` (conventional commits: `feat: add button component`).
10. На PR автоматически: Chromatic собирает превью-билд **этой ветки** с визуальными диффами (без авто-принятия — дизайнер аппрувит), Vercel даёт preview-URL, CI гоняет build/ts51/e2e. Правки по ревью — новые коммиты в ту же ветку, превью обновляется.
11. После аппрува — **мёрж PR в `main` = публикация**: Chromatic обновляет baseline (`autoAcceptChanges: "main"`), Vercel передеплоивает registry (`public/r/`) для `shadcn add`. В `main` не пушим WIP.

## Команды

- `npm run storybook` — dev-сервер Storybook (порт 6006)
- `npm run registry:build` — собрать registry JSON в `public/r/`
- `npm run check:ts51` — проверка registry под TS консьюмеров
- `npm run build` / `npm run build-storybook`

## Инфраструктура

- Storybook публикуется в Chromatic (`.github/workflows/chromatic.yml`, секрет `CHROMATIC_PROJECT_TOKEN`)
- Registry хостится на Vercel (статика `public/r/`, CORS в `vercel.json`)
- Разработчики подключают registry в своих `components.json`: `"@lantern": "<registry-url>/r/{name}.json"`

## Деплой

Деплой завязан на git, локально ничего не публикуется (`npm run storybook` :6006 + все проверки — на машине).

- **push в `main`** = прод: Chromatic обновляет канонический Storybook (авто-baseline) + Vercel передеплоивает registry для `shadcn add`.
- **pull_request** = превью: Chromatic собирает diff-билд ветки (ревью/аппрув, без авто-принятия) + Vercel preview-URL. Прод не трогается.

**Дефолт (решение Alex, 2026-06-17): новый компонент → feature-ветка → PR-превью для ревью → мёрж в `main` только когда отполировано.** В `main` не пушим полуфабрикат, чтобы публичный Storybook и устанавливаемый registry показывали только готовое.
