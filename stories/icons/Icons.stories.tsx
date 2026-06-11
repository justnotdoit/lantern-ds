import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as Icons from "@/registry/default/icons";

type IconEntry = { name: string; Component: React.ComponentType<{ size?: number | string }> };

const ALL_ICONS: IconEntry[] = Object.entries(Icons)
  .filter(([, value]) => typeof value === "object" || typeof value === "function")
  .map(([name, Component]) => ({ name, Component: Component as IconEntry["Component"] }))
  .sort((a, b) => a.name.localeCompare(b.name));

const CUSTOM = ALL_ICONS.filter((i) => i.name.endsWith("Icon"));
const LUCIDE = ALL_ICONS.filter((i) => !i.name.endsWith("Icon"));

function IconGrid({ icons }: { icons: IconEntry[] }) {
  return (
    <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
      {icons.map(({ name, Component }) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-md border border-border p-3"
          title={name}
        >
          <Component size={20} />
          <code className="w-full truncate text-center text-[10px] text-muted-foreground">
            {name}
          </code>
        </div>
      ))}
    </div>
  );
}

function Gallery() {
  const [query, setQuery] = useState("");
  const match = (entry: IconEntry) => entry.name.toLowerCase().includes(query.toLowerCase());
  const custom = CUSTOM.filter(match);
  const lucide = LUCIDE.filter(match);

  return (
    <div className="flex flex-col gap-6 bg-background p-6 text-foreground">
      <div className="flex flex-col gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons…"
          className="h-9 w-64 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-sm text-muted-foreground">
          Install: <code>npx shadcn@latest add @lantern/icons</code> · import:{" "}
          <code>{'import { HouseIcon, Search } from "@/components/icons"'}</code>
        </p>
      </div>

      {custom.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">
            Lantern icons <span className="text-sm font-normal text-muted-foreground">({custom.length})</span>
          </h2>
          <IconGrid icons={custom} />
        </section>
      )}

      {lucide.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">
            Lucide subset <span className="text-sm font-normal text-muted-foreground">({lucide.length})</span>
          </h2>
          <IconGrid icons={lucide} />
        </section>
      )}

      {custom.length === 0 && lucide.length === 0 && (
        <p className="text-sm text-muted-foreground">No icons match “{query}”.</p>
      )}
    </div>
  );
}

const meta = {
  title: "Icons/Gallery",
  component: Gallery,
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {};
