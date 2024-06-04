import type { TransitionProps } from "./types";

export interface ZoomProps extends TransitionProps {
  appear?: boolean;
  children: React.ReactElement<any, any>;
  disableNativeDriver?: boolean;
}
