import type { TransitionProps } from "./types";

export type GrowProps = Omit<TransitionProps, "timeout"> & {
  appear?: boolean;
  children: React.ReactElement<any, any>;
  disableNativeDriver?: boolean;
  timeout?: number | { enter: number; exit: number } | "auto";
};
