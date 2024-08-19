import type { Role, ViewProps } from "react-native";
import type { TransitionProps, TransitionStyle } from "./types";

export interface CollapseProps
  extends Omit<TransitionProps, keyof ViewProps | "mountOnEnter" | "timeout"> {
  "aria-labelledby"?: string;
  children?: React.ReactNode;
  collapsedSize?: number;
  id?: string;
  orientation?: "horizontal" | "vertical";
  role?: Role;
  style?: TransitionStyle;
  timeout?: TransitionProps["timeout"] | "auto";
}
