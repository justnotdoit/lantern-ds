import type * as React from "react";

export interface LanternIconProps extends React.SVGProps<SVGSVGElement> {
  /** Width and height in px. Lantern icons are drawn on a 16px grid. */
  size?: number | string;
}
