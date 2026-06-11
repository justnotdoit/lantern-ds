# Lantern Design System

Готовые React-компоненты дизайн-системы Lantern. Дизайн ведётся в Figma (на базе [Obra shadcn/ui](https://obra.studio/)), компоненты совместимы со стеком продуктов: **React 18.3, TypeScript 5.1, Tailwind CSS 3.4, shadcn/ui (style "default")**.

## Для разработчиков: как использовать

### 1. Посмотреть компоненты

Storybook: <https://main--6a2b25e7619f2101c4a0fbee.chromatic.com> (актуальная ветка `main`).

### 2. Установить компонент в свой проект

Требования: проект с настроенным shadcn/ui (есть `components.json`) на Tailwind v3.

Один раз добавьте registry в `components.json`:

```json
{
  "registries": {
    "@lantern": "https://lantern-registry.vercel.app/r/{name}.json"
  }
}
```

Дальше устанавливайте компоненты как обычные shadcn-компоненты:

```bash
npx shadcn@latest add @lantern/button
```

Код компонента копируется в ваш проект (`src/components/ui/...`) вместе с npm-зависимостями. Никакого рантайм-пакета — компонент становится вашим кодом.

## Для мейнтейнеров

```bash
npm install
npm run storybook        # dev-сервер на :6006
npm run registry:build   # собрать registry JSON в public/r/
npm run check:ts51       # совместимость registry с TS 5.1 (стек консьюмеров)
```

Процесс перевода Figma → код описан в [CLAUDE.md](CLAUDE.md).

### Инфраструктура

| Что | Где |
|---|---|
| Storybook | Chromatic, автодеплой из GitHub Actions (`chromatic.yml`) |
| Registry (статика `public/r/`) | Vercel |
| E2e-проверка установки | `fixtures/consumer-v3` + `ci.yml` |
