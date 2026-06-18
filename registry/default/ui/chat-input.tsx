import * as React from "react";
import { AtSign, Paperclip, Sparkle } from "lucide-react";

import { cn } from "@/lib/utils";
import { SendButton } from "@/components/ui/send-button";

export interface ChatInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onSubmit"> {
  /** Controlled text value. Omit for uncontrolled use. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Fires on every keystroke. */
  onValueChange?: (value: string) => void;
  /** Fires on Enter (without Shift) or the send button while the value is non-empty. */
  onSend?: (value: string) => void;
  /** Fires when the send button is pressed while `inProgress`. */
  onStop?: () => void;
  /** Placeholder shown when empty. */
  placeholder?: string;
  /**
   * Generating — the send button becomes a stop control. Controlled when set;
   * when omitted, the component enters in-progress on send and leaves it on stop.
   */
  inProgress?: boolean;
  /** Disables the textarea, the actions, and the send button. */
  disabled?: boolean;
  onAttachClick?: () => void;
  onMentionClick?: () => void;
  onEnhanceClick?: () => void;
}

const actionButtonClassName =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none ring-offset-background transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0";

const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      onSend,
      onStop,
      placeholder = "Message agent...",
      inProgress,
      disabled = false,
      onAttachClick,
      onMentionClick,
      onEnhanceClick,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const currentValue = isControlled ? value : internalValue;

    const isInProgressControlled = inProgress !== undefined;
    const [internalInProgress, setInternalInProgress] = React.useState(false);
    const currentInProgress = isInProgressControlled ? inProgress : internalInProgress;

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Auto-grow the textarea with its content (capped by max-height + scroll).
    React.useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [currentValue]);

    const setValue = (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    };

    const canSend = !disabled && !currentInProgress && currentValue.trim().length > 0;
    const sendState = currentInProgress ? "in-progress" : canSend ? "enabled" : "disabled";

    const handleSend = () => {
      if (!canSend) return;
      onSend?.(currentValue);
      if (!isControlled) setInternalValue("");
      // Uncontrolled: flip to the in-progress (stop) state on send.
      if (!isInProgressControlled) setInternalInProgress(true);
    };

    const handleStop = () => {
      onStop?.();
      if (!isInProgressControlled) setInternalInProgress(false);
    };

    const handleSendButton = () => {
      if (currentInProgress) handleStop();
      else handleSend();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-[364px] max-w-full flex-col gap-3 overflow-hidden rounded-xl border border-border bg-background p-3",
          className,
        )}
        {...props}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          className="max-h-[500px] w-full resize-none overflow-y-auto border-0 bg-transparent p-0 text-sm font-normal leading-5 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Attach file"
              disabled={disabled}
              onClick={onAttachClick}
              className={actionButtonClassName}
            >
              <Paperclip />
            </button>
            <button
              type="button"
              aria-label="Mention"
              disabled={disabled}
              onClick={onMentionClick}
              className={actionButtonClassName}
            >
              <AtSign />
            </button>
            <button
              type="button"
              aria-label="Enhance"
              disabled={disabled}
              onClick={onEnhanceClick}
              className={actionButtonClassName}
            >
              <Sparkle />
            </button>
          </div>

          <SendButton state={sendState} onClick={handleSendButton} />
        </div>
      </div>
    );
  },
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
