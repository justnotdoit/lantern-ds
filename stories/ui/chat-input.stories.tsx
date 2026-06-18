/**
 * CHAT INPUT — ACCEPTED DESIGN DECISIONS (Figma review, 2026-06-17).
 * Source: Figma "Design", node 9090:26287 (ChatField). Reuses the SendButton component.
 * After any edit, re-check this list and measure geometry (Playwright).
 *
 * 1. Container: w-[364px] default (max-w-full, overridable via className), rounded-xl,
 *    border-border, bg-background, p-3, gap-3 (sm=12), overflow-hidden.
 * 2. Textarea: paragraph small/regular (text-sm/leading-5, font-normal); text-foreground,
 *    placeholder text-muted-foreground ("Message agent..."). No manual resize handle
 *    (resize-none); auto-grows with content, capped at 500px then scrolls (Alex, 2026-06-17).
 * 3. Bottom row (justify-between): left = three 32px ghost icon buttons (gap-1) —
 *    Paperclip / AtSign / Sparkle, text-muted-foreground, hover bg-black/5;
 *    right = <SendButton> (reused).
 * 4. Send state is derived: empty/disabled → "disabled", has text → "enabled",
 *    in-progress → "in-progress" (stop). Enter sends; Shift+Enter = newline.
 *    Pressing send flips the button to in-progress (stop); pressing stop leaves it.
 *    `inProgress` is controllable (real apps drive it from the backend); when omitted
 *    the component toggles it itself on send/stop (Alex, 2026-06-17).
 * 5. Controlled (value/onValueChange) or uncontrolled; onSend / onStop callbacks.
 *
 * OPEN (untokenized in Figma — confirm with Alex):
 *   - ghost icon-button hover (Figma fill is transparent, no hover shown) → hover:bg-black/5
 *     (consistent with the app-card "more" button).
 *   - left action labels (Attach / Mention / Enhance) are best-guess — confirm intent.
 */
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatInput } from "@/registry/default/ui/chat-input";

const meta = {
  title: "UI/Chat Input",
  component: ChatInput,
  parameters: {
    layout: "centered",
  },
  args: {
    placeholder: "Message agent...",
  },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Empty — send is disabled until something is typed. Type to enable, then press Send
 * (or Enter): the button switches to the in-progress stop control. Press it to stop.
 */
export const Default: Story = {};

/** Pre-filled — send button is enabled. */
export const WithText: Story = {
  args: { defaultValue: "Summarise the latest signals for my tracked accounts" },
};

/** Generating — the send button becomes a stop control. */
export const InProgress: Story = {
  args: {
    defaultValue: "Summarise the latest signals for my tracked accounts",
    inProgress: true,
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Controlled example wiring onSend to a simple log of submitted messages. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const [sent, setSent] = useState<string[]>([]);
    return (
      <div className="flex w-[364px] flex-col gap-3">
        <ChatInput
          {...args}
          value={value}
          onValueChange={setValue}
          onSend={(message) => {
            setSent((prev) => [...prev, message]);
            setValue("");
          }}
        />
        {sent.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
            {sent.map((message, index) => (
              <li key={index} className="rounded-md bg-muted px-3 py-2 text-foreground">
                {message}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
};
