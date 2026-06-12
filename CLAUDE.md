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

- Spacing и shadows совпадают со стандартной шкалой Tailwind — обычные `p-*`, `gap-*`, `shadow-*`.
- **Радиусы: имена в Figma сдвинуты на шаг** относительно Tailwind: figma `rounded-xs`=2px=tw `rounded-sm`, figma `rounded-sm`=4px=tw `rounded`, figma `rounded-md`=6px=tw `rounded-md`, figma `rounded-lg`=8px=tw `rounded-lg`. Компонентный токен `radius`=10px → `--radius` (в shadcn-компонентах сейчас это не «стандартный» rounded-lg — сверяйся со значением в px из Figma).
- Типографика: Inter; heading 1 → `text-5xl leading-none font-semibold tracking-[-1.5px]`, heading 2 → `text-3xl leading-none font-semibold tracking-[-1px]`, heading 3 → `text-2xl font-semibold tracking-[-1px]`, heading 4 → `text-xl leading-6 font-semibold`, параграфы large/regular/small/mini → `text-lg`/`text-base`/`text-sm`/`text-xs`.
- Цвета — только семантические токены (`bg-primary`, `text-muted-foreground`, `bg-tooltip`...). Никогда не хардкодить hex из Figma: если в макете цвет, которого нет в маппинге, — спросить дизайнера, какой это токен.
- **ПРАВИЛО (от Alex, 2026-06-12): каждый видимый элемент обязан быть явно привязан к токену** — цвет, размер, типографика, скругление. Никогда не полагаться на случайные дефолты (например, дефолтный размер lucide-иконки 24px) или на наследование, которое может сломаться при перемещении элемента. После любого изменения вёрстки — проходить по всем затронутым элементам и сверять с токенами дизайна. Один и тот же тип элемента (пункт меню, имя агента) везде выглядит одинаково, без точечных переопределений в местах использования.

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
8. E2e: поднять `npx serve public -l 8080`, в фикстуре `npx shadcn@latest add @lantern/<name> --yes --overwrite`, затем `npm run build` в фикстуре.
9. Коммит (conventional commits: `feat: add button component`).

## Команды

- `npm run storybook` — dev-сервер Storybook (порт 6006)
- `npm run registry:build` — собрать registry JSON в `public/r/`
- `npm run check:ts51` — проверка registry под TS консьюмеров
- `npm run build` / `npm run build-storybook`

## Инфраструктура

- Storybook публикуется в Chromatic (`.github/workflows/chromatic.yml`, секрет `CHROMATIC_PROJECT_TOKEN`)
- Registry хостится на Vercel (статика `public/r/`, CORS в `vercel.json`)
- Разработчики подключают registry в своих `components.json`: `"@lantern": "<registry-url>/r/{name}.json"`
