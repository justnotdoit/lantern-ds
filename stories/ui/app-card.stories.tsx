/**
 * APP CARD — ACCEPTED DESIGN DECISIONS (Figma review, 2026-06-17).
 * Source: Figma "Design" file, node 9255:37453 (app-card: default / hover / pinned).
 * Before any edit, check this list; after editing, run the geometry regression
 * (getBoundingClientRect via Playwright) in default + hover + pinned.
 *
 * 1. Self-contained component (no generic Card primitive yet — there is no Figma
 *    "Card" spec, only app-card). A Card primitive can be extracted later.
 * 2. Token binding (every visible element):
 *    - Container: border-border, rounded-xl (12px), bg-card.
 *    - Title: text-foreground, text-sm/leading-5, font-medium  (paragraph small/medium).
 *      Rendered as a heading (default h3, configurable via headingLevel) for a11y —
 *      styling is identical; Tailwind preflight resets heading margins.
 *      Truncates to a single line (truncate) — never wraps (Alex, 2026-06-17).
 *    - Chips + description + footer: text-xs/leading-4, font-normal (paragraph mini/regular).
 *    - "Live" pill text + "Pinned" text: text-secondary-foreground.
 *    - Footer text + Atom + Pin icons: text-muted-foreground.
 * 3. Hover is a CSS state, not a prop. Whole card: hover:bg-muted/50 (≈ #fafafa).
 *    The "more" (Ellipsis) button is absolute (no layout shift) and fades in on
 *    group-hover / focus-visible.
 * 4. Pinned is a boolean prop → gray "Pinned" pill with the Pin glyph.
 * 5. Icons: Atom = sources, Pin = pinned, Ellipsis = more. Status dot is a solid
 *    lime-500 circle (size-2), not an icon.
 * 6. Geometry: sections p-3 (12px); main gap-2 (8px); footer border-t; chips
 *    px-2 py-0.5 rounded-full gap-1; dot size-2 (8px); Pin/Atom size-3 (12px);
 *    Ellipsis size-4 (16px) inside a size-6 (24px) button.
 *
 * OPEN (untokenized in Figma — confirm intended tokens with Alex):
 *   - card hover surface  #fafafa  ("unofficial/accent 0")   → bg-muted/50 (exact)
 *   - more-button hover   rgba(0,0,0,.05) ("unofficial/ghost hover") → bg-black/5 (exact)
 *   - "Pinned" pill bg    #f2f4f7  ("Gray/100")              → bg-gray-100 (raw scale)
 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppCard } from "@/registry/default/ui/app-card";

const meta = {
  title: "UI/App Card",
  component: AppCard,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "GTM Signal Breakdown",
    description:
      "Pipeline coverage across tracked Calgary SEO competitors with signal mix and hiring trends.",
    status: "Live",
    sourceCount: 2,
    updatedAt: "8m ago",
    onContextSelect: () => {},
  },
  argTypes: {
    onContextSelect: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pinned: Story = {
  args: { pinned: true },
};

export const LongTitle: Story = {
  args: {
    title: "GTM Signal Breakdown for High Growth Global 2000 accounts",
  },
};
