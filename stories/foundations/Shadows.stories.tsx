import type { Meta, StoryObj } from "@storybook/react-vite";

const SHADOWS = ["shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"];

function ShadowScale() {
  return (
    <div className="flex flex-col gap-4 bg-background p-6 text-foreground">
      <p className="text-sm text-muted-foreground">
        Lantern shadows match the standard Tailwind scale — use the
        <code> shadow-*</code> classes as is.
      </p>
      <div className="grid grid-cols-3 gap-8 p-4">
        {SHADOWS.map((cls) => (
          <div key={cls} className="flex flex-col items-center gap-2">
            <div className={`h-24 w-32 rounded-lg border border-border bg-card ${cls}`} />
            <code className="text-xs text-muted-foreground">{cls}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Shadows",
  component: ShadowScale,
} satisfies Meta<typeof ShadowScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
