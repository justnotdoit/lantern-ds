import * as React from "react";
import { Atom, Ellipsis, Pin } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card title — paragraph small / medium (14px, 500). */
  title: string;
  /**
   * Heading level for the title so the card slots into the page outline.
   * Rendered as `h{headingLevel}` (styling is unchanged). Defaults to 3.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Supporting copy — paragraph mini / regular (12px, 400). */
  description: string;
  /** Status label rendered as the lime "Live" pill. Omit to hide. */
  status?: string;
  /** Number of sources shown next to the Atom glyph in the footer. */
  sourceCount?: number;
  /** Relative time label, e.g. "8m ago". */
  updatedAt?: string;
  /** Shows the gray "Pinned" pill. */
  pinned?: boolean;
  /** Invoked by the hover/focus "more" (ellipsis) button. */
  onContextSelect?: () => void;
  /** Accessible label for the "more" button. */
  contextLabel?: string;
}

const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(
  (
    {
      className,
      title,
      headingLevel = 3,
      description,
      status,
      sourceCount,
      updatedAt,
      pinned = false,
      onContextSelect,
      contextLabel = "More options",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex w-full flex-col rounded-xl border border-border bg-card text-card-foreground transition-colors hover:bg-muted/50",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-2 p-3">
          {React.createElement(
            `h${headingLevel}`,
            { className: "truncate text-sm font-medium leading-5 text-foreground" },
            title,
          )}

          {(status || pinned) && (
            <div className="flex items-center gap-2">
              {status && (
                <span className="inline-flex items-center gap-1 rounded-full bg-lime-100 px-2 py-0.5 text-xs font-normal leading-4 text-secondary-foreground">
                  <span className="size-2 shrink-0 rounded-full bg-lime-500" aria-hidden="true" />
                  {status}
                </span>
              )}
              {pinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal leading-4 text-secondary-foreground">
                  <Pin className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                  Pinned
                </span>
              )}
            </div>
          )}

          <p className="break-words text-xs font-normal leading-4 text-foreground">{description}</p>
        </div>

        <div className="flex items-center justify-between border-t border-border p-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Atom className="size-3 shrink-0" aria-hidden="true" />
            {sourceCount != null && (
              <span className="text-xs font-normal leading-4">
                {sourceCount} {sourceCount === 1 ? "source" : "sources"}
              </span>
            )}
          </div>
          {updatedAt && (
            <span className="text-xs font-normal leading-4 text-muted-foreground">{updatedAt}</span>
          )}
        </div>

        {onContextSelect && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onContextSelect();
            }}
            className="absolute right-3 top-2.5 inline-flex size-6 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-black/5 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 [&>svg]:size-4 [&>svg]:shrink-0"
          >
            <Ellipsis aria-hidden="true" />
            <span className="sr-only">{contextLabel}</span>
          </button>
        )}
      </div>
    );
  },
);
AppCard.displayName = "AppCard";

export { AppCard };
