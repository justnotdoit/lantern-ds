import type { Meta, StoryObj } from "@storybook/react-vite";

const TOKEN_GROUPS: Record<string, string[]> = {
  Base: ["background", "foreground", "border", "input", "ring"],
  Brand: ["primary", "primary-foreground", "secondary", "secondary-foreground"],
  Surfaces: ["card", "card-foreground", "popover", "popover-foreground"],
  States: [
    "muted",
    "muted-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "destructive-foreground",
  ],
};

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: `hsl(var(--${token}))` }}
      />
      <code className="text-sm text-foreground">--{token}</code>
    </div>
  );
}

function ColorPalette() {
  return (
    <div className="flex flex-col gap-8 bg-background p-6 text-foreground">
      {Object.entries(TOKEN_GROUPS).map(([group, tokens]) => (
        <section key={group}>
          <h2 className="mb-3 text-lg font-semibold">{group}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {tokens.map((token) => (
              <Swatch key={token} token={token} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Colors",
  component: ColorPalette,
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {};
