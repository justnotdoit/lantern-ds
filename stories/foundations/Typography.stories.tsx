import type { Meta, StoryObj } from "@storybook/react-vite";

interface TypeSample {
  figmaToken: string;
  tailwindClass: string;
  className: string;
  sample: string;
}

const SAMPLES: TypeSample[] = [
  {
    figmaToken: "heading 1 — 48/48 Semibold, -1.5px",
    tailwindClass: "text-5xl leading-none font-semibold tracking-[-1.5px]",
    className: "text-5xl leading-none font-semibold tracking-[-1.5px]",
    sample: "Heading 1",
  },
  {
    figmaToken: "heading 2 — 30/30 Semibold, -1px",
    tailwindClass: "text-3xl leading-none font-semibold tracking-[-1px]",
    className: "text-3xl leading-none font-semibold tracking-[-1px]",
    sample: "Heading 2",
  },
  {
    figmaToken: "heading 3 — 24/28.8 Semibold, -1px",
    tailwindClass: "text-2xl font-semibold tracking-[-1px]",
    className: "text-2xl font-semibold tracking-[-1px]",
    sample: "Heading 3",
  },
  {
    figmaToken: "heading 4 — 20/24 Semibold",
    tailwindClass: "text-xl leading-6 font-semibold",
    className: "text-xl leading-6 font-semibold",
    sample: "Heading 4",
  },
  {
    figmaToken: "paragraph large — 18/27 Regular",
    tailwindClass: "text-lg",
    className: "text-lg",
    sample: "Параграф large: почти каждый интерфейс начинается с текста.",
  },
  {
    figmaToken: "paragraph regular — 16/24 Regular",
    tailwindClass: "text-base",
    className: "text-base",
    sample: "Параграф regular: почти каждый интерфейс начинается с текста.",
  },
  {
    figmaToken: "paragraph small — 14/20 Regular",
    tailwindClass: "text-sm",
    className: "text-sm",
    sample: "Параграф small: почти каждый интерфейс начинается с текста.",
  },
  {
    figmaToken: "paragraph mini — 12/16 Regular",
    tailwindClass: "text-xs",
    className: "text-xs",
    sample: "Параграф mini: почти каждый интерфейс начинается с текста.",
  },
  {
    figmaToken: "monospaced — 16/24 Regular",
    tailwindClass: "font-mono text-base",
    className: "font-mono text-base",
    sample: "const lantern = true;",
  },
];

function TypeScale() {
  return (
    <div className="flex flex-col gap-8 bg-background p-6 text-foreground">
      <p className="text-sm text-muted-foreground">
        Шрифт: <strong className="text-foreground">Inter</strong> (font-sans).
        Колонка справа — класс Tailwind, которым этот стиль набирается в коде.
      </p>
      {SAMPLES.map((item) => (
        <div key={item.figmaToken} className="flex flex-col gap-1">
          <div className={item.className}>{item.sample}</div>
          <div className="text-xs text-muted-foreground">
            {item.figmaToken} · <code>{item.tailwindClass}</code>
          </div>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Typography",
  component: TypeScale,
} satisfies Meta<typeof TypeScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
