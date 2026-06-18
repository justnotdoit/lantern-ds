import * as React from "react";
import { ArrowUp, Square } from "lucide-react";

import { cn } from "@/lib/utils";

export type SendButtonState = "enabled" | "disabled" | "in-progress";

export interface SendButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual/interaction state:
   * - `enabled` — primary (violet) circle, up-arrow, ready to send.
   * - `disabled` — outlined white circle, muted up-arrow, not interactive.
   * - `in-progress` — outlined circle with a stop (square) glyph; click to halt.
   */
  state?: SendButtonState;
}

const SendButton = React.forwardRef<HTMLButtonElement, SendButtonProps>(
  ({ className, state = "enabled", type = "button", disabled, ...props }, ref) => {
    const isInProgress = state === "in-progress";
    const isDisabled = state === "disabled" || disabled;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={isInProgress ? "Stop" : "Send"}
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-full outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
          state === "enabled" && "bg-primary text-primary-foreground hover:bg-primary/90",
          state === "disabled" && "border border-border bg-background text-neutral-400",
          isInProgress && "border border-neutral-300 bg-background text-foreground shadow-sm hover:bg-muted/50",
          className,
        )}
        {...props}
      >
        {isInProgress ? <Square /> : <ArrowUp />}
      </button>
    );
  },
);
SendButton.displayName = "SendButton";

export { SendButton };
