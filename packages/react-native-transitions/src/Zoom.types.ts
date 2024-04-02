import type { TransitionProps } from "./types";

export type ZoomProps = TransitionProps & {
  appear?: boolean;
  children: React.ReactElement<any, any>;
  disableNativeDriver?: boolean;
};
