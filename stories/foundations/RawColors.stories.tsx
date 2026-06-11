import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import data from "./raw-colors.generated.json";

const SHADES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const SCALES = Object.keys(data.palette);
const CUSTOM = new Set(data.customScales);

function ScaleRow({ scale }: { scale: string }) {
  const shades = data.palette[scale as keyof typeof data.palette] as Record<string, string>;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <h3 className="text-sm font-medium">{scale}</h3>
        {CUSTOM.has(scale) && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
            Lantern custom
          </span>
        )}
      </div>
      <div className="grid grid-cols-11 gap-1">
        {SHADES.map((shade) => {
          const hex = shades[shade];
          if (!hex) return <div key={shade} />;
          return (
            <div key={shade} className="flex flex-col gap-1">
              <div
                className="h-10 rounded-md border border-border"
                style={{ backgroundColor: hex }}
                title={`${scale}-${shade} ${hex}`}
              />
              <div className="text-center text-[10px] text-muted-foreground">{shade}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RawPalette() {
  const [query, setQuery] = useState("");
  const scales = SCALES.filter((s) => s.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="flex flex-col gap-6 bg-background p-6 text-foreground">
      <div className="flex flex-col gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter scales…"
          className="h-9 w-64 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="max-w-2xl text-sm text-muted-foreground">
          Raw color scales. Use them via regular Tailwind classes
          (<code>bg-orange-500</code>, <code>text-red-600</code>…). Scales marked{" "}
          <em>Lantern custom</em> differ from the default Tailwind palette and are
          overridden by the <code>@lantern/theme-lantern</code> registry item — the same
          class names render Lantern values. Prefer semantic tokens
          (<code>bg-primary</code>, <code>bg-destructive</code>) where one exists.
        </p>
      </div>
      {scales.map((scale) => (
        <ScaleRow key={scale} scale={scale} />
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations/Raw Colors",
  component: RawPalette,
} satisfies Meta<typeof RawPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {};
