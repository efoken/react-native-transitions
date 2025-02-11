import type { NativeMethods } from "react-native";
import type { TransitionProps } from "./types";

export type SlideDirection = "left" | "right" | "up" | "down";

export interface SlideProps extends TransitionProps {
  appear?: boolean;
  children: React.ReactElement<any, any>;
  container?:
    | HTMLElement
    | Omit<NativeMethods, "refs">
    | (() => HTMLElement | Omit<NativeMethods, "refs"> | undefined);
  direction?: SlideDirection;
  disableNativeDriver?: boolean;
}
