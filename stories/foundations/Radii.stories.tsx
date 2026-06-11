import type { Meta, StoryObj } from "@storybook/react-vite";

const RADII: { figmaToken: string; tailwindClass: string; px: string }[] = [
  { figmaToken: "rounded-xs (radius-2)", tailwindClass: "rounded-sm", px: "2px" },
  { figmaToken: "rounded-sm (radius-4)", tailwindClass: "rounded", px: "4px" },
  { figmaToken: "rounded-md (radius-6)", tailwindClass: "rounded-md", px: "6px" },
  { figmaToken: "rounded-lg (radius-8)", tailwindClass: "rounded-lg", px: "8px" },
  { figmaToken: "radius (radius-10) — component token", tailwindClass: "rounded-[var(--radius)]", px: "10px" },
  { figmaToken: "rounded-xl (radius-12)", tailwindClass: "rounded-xl", px: "12px" },
  { figmaToken: "rounded-2xl (radius-16)", tailwindClass: "rounded-2xl", px: "16px" },
  { figmaToken: "rounded-3xl (radius-24)", tailwindClass: "rounded-3xl", px: "24px" },
  { figmaToken: "rounded-full (radius-infinite)", tailwindClass: "rounded-full", px: "∞" },
];

function RadiiScale() {
  return (
    <div className="flex flex-col gap-4 bg-background p-6 text-foreground">
      <p className="text-sm text-muted-foreground">
        Note: Figma token names are shifted one step relative to Tailwind
        (figma <code>rounded-sm</code> = 4px = tailwind <code>rounded</code>).
        Lantern component radius: <code>--radius: 10px</code> —
        in shadcn components that is <code>rounded-lg</code> (= var(--radius)).
      </p>
      <div className="grid grid-cols-3 gap-4">
        {RADII.map((r) => (
          <div key={r.figmaToken} className="flex items-center gap-3">
            <div
              className="h-16 w-16 shrink-0 border-2 border-primary bg-accent"
              style={{ borderRadius: r.px === "∞" ? "9999px" : r.px }}
            />
            <div className="text-xs">
              <div className="font-medium">{r.px}</div>
              <div className="text-muted-foreground">{r.figmaToken}</div>
              <code className="text-muted-foreground">{r.tailwindClass}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Radii",
  component: RadiiScale,
} satisfies Meta<typeof RadiiScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
