import type { TransitionProps } from "./types";

export interface FadeProps extends TransitionProps {
  appear?: boolean;
  children: React.ReactElement<any, any>;
  disableNativeDriver?: boolean;
}
