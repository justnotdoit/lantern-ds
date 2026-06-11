import type { Meta, StoryObj } from "@storybook/react-vite";

const STEPS: { name: string; px: number; figma: string }[] = [
  { name: "0.5", px: 2, figma: "3xs" },
  { name: "1", px: 4, figma: "2xs" },
  { name: "2", px: 8, figma: "xs" },
  { name: "3", px: 12, figma: "sm" },
  { name: "4", px: 16, figma: "md" },
  { name: "5", px: 20, figma: "lg" },
  { name: "6", px: 24, figma: "xl" },
  { name: "8", px: 32, figma: "2xl" },
  { name: "10", px: 40, figma: "3xl" },
  { name: "12", px: 48, figma: "4xl" },
  { name: "16", px: 64, figma: "5xl" },
];

function SpacingScale() {
  return (
    <div className="flex flex-col gap-3 bg-background p-6 text-foreground">
      <p className="text-sm text-muted-foreground">
        The Lantern spacing scale matches the standard Tailwind scale
        (4px step). Named Figma tokens (3xs…5xl) are aliases of the same values:
        use the regular <code>p-*</code>, <code>gap-*</code>, <code>m-*</code> classes.
      </p>
      {STEPS.map((s) => (
        <div key={s.name} className="flex items-center gap-3 text-xs">
          <code className="w-24 shrink-0 text-muted-foreground">
            {s.name} · {s.figma}
          </code>
          <div className="h-4 bg-primary" style={{ width: s.px }} />
          <span className="text-muted-foreground">{s.px}px</span>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Spacing",
  component: SpacingScale,
} satisfies Meta<typeof SpacingScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
