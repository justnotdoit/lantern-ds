# Lantern Design System

Ready-to-use React components of the Lantern design system. Designs live in Figma (based on [Obra shadcn/ui](https://obra.studio/)); components are compatible with the product stack: **React 18.3, TypeScript 5.1, Tailwind CSS 3.4, shadcn/ui (style "default")**.

## For developers

### 1. Browse components

Storybook: <https://main--6a2b25e7619f2101c4a0fbee.chromatic.com> (current `main`).

### 2. Install a component into your project

Requirements: a Tailwind v3 project with shadcn/ui set up (a `components.json` exists).

Add the registry to your `components.json` once:

```json
{
  "registries": {
    "@lantern": "https://lantern-registry.vercel.app/r/{name}.json"
  }
}
```

Then install components like regular shadcn components:

```bash
npx shadcn@latest add @lantern/button
```

The component code is copied into your project (`src/components/ui/...`) together with its npm dependencies. No runtime package — the component becomes your code.

## For maintainers

```bash
npm install
npm run storybook        # dev server on :6006
npm run sync:tokens      # regenerate CSS variables from tokens/lantern-tokens.json
npm run registry:build   # build registry JSON into public/r/
npm run check:ts51       # registry compatibility with TS 5.1 (consumer stack)
```

The Figma → code process is described in [CLAUDE.md](CLAUDE.md).

### Infrastructure

| What | Where |
|---|---|
| Storybook | Chromatic, auto-deployed from GitHub Actions (`chromatic.yml`) |
| Registry (static `public/r/`) | Vercel |
| E2e install check | `fixtures/consumer-v3` + `ci.yml` |
