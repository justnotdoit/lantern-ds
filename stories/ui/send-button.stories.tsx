/**
 * SEND BUTTON — ACCEPTED DESIGN DECISIONS (Figma review, 2026-06-17).
 * Source: Figma "Design", node 1109:7914 (send-button: enabled / disabled / in-progress).
 * After any edit, re-check this list and measure geometry (Playwright) in all 3 states.
 *
 * 1. 32px circular icon button (size-8, rounded-full), 16px glyph (size-4), p-2 via centering.
 * 2. Icons: ArrowUp for enabled & disabled; Square (stop) for in-progress.
 * 3. Token binding per state:
 *    - enabled:     bg-primary + text-primary-foreground (hover bg-primary/90).
 *    - disabled:    bg-background + border-border + text-neutral-400; native `disabled`.
 *    - in-progress: bg-background + border-neutral-300 + shadow-sm + text-foreground (Square).
 * 4. shadow-sm = Figma shadow-xs (0 1px 2px rgba(0,0,0,.05)) exactly.
 * 5. `state` is the source of truth; state="disabled" also sets the native disabled attr.
 *    Defaults to type="button" so it never submits a form unless asked.
 *
 * OPEN (untokenized in Figma — confirm tokens with Alex):
 *   - in-progress fill  rgba(255,255,255,.1) ("unofficial/outline")  → bg-background (white on white)
 *   - in-progress border #d4d4d4 ("unofficial/border 3")            → border-neutral-300 (exact)
 *   - disabled glyph    #a3a3a3 ("neutral/400")                     → text-neutral-400 (raw scale, exact)
 *   Hovers are inferred from house convention (Figma shows only the 3 base states).
 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SendButton } from "@/registry/default/ui/send-button";

const meta = {
  title: "UI/Send Button",
  component: SendButton,
  parameters: {
    layout: "centered",
  },
  args: {
    state: "enabled",
  },
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["enabled", "disabled", "in-progress"],
    },
  },
} satisfies Meta<typeof SendButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = {};

export const Disabled: Story = {
  args: { state: "disabled" },
};

export const InProgress: Story = {
  args: { state: "in-progress" },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SendButton state="disabled" />
      <SendButton state="enabled" />
      <SendButton state="in-progress" />
    </div>
  ),
};
