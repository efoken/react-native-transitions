import type { TransitionProps } from "./types";

export type FadeProps = TransitionProps & {
  appear?: boolean;
  children: React.ReactElement<any, any>;
  disableNativeDriver?: boolean;
};
