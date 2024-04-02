import { NativeMethods } from "react-native";
import type { TransitionProps } from "./types";

export type SlideDirection = "left" | "right" | "up" | "down";

export type SlideProps = TransitionProps & {
  appear?: boolean;
  children: React.ReactElement<any, any>;
  container?:
    | HTMLElement
    | NativeMethods
    | (() => HTMLElement | NativeMethods | undefined);
  direction?: SlideDirection;
  disableNativeDriver?: boolean;
};
