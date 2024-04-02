import type { TransitionProps } from "./types";

export type GrowProps = TransitionProps & {
  appear?: boolean;
  children: React.ReactElement<any, any>;
  disableNativeDriver?: boolean;
};
