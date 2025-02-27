import type { NativeMethods, ViewProps, ViewStyle } from "react-native";

export type TransitionEasing =
  | "ease"
  | "ease-in"
  | "ease-in-out"
  | "ease-out"
  | "linear"
  | (string & {});

export interface TransitionStyle extends ViewStyle {
  transitionBehavior?: React.CSSProperties["transitionBehavior"];
  transitionDelay?: React.CSSProperties["transitionDelay"];
  transitionDuration?: React.CSSProperties["transitionDuration"];
  transitionProperty?: React.CSSProperties["transitionProperty"];
  transitionTimingFunction?: TransitionEasing;
}

export interface TransitionHandlerProps<T> {
  onEnter?: (node: T) => void;
  onEntered?: (node: T) => void;
  onEntering?: (node: T) => void;
  onExit?: (node: T) => void;
  onExited?: (node: T) => void;
  onExiting?: (node: T) => void;
}

export interface TransitionProps
  extends TransitionHandlerProps<HTMLElement | Omit<NativeMethods, "refs">>,
    Omit<ViewProps, "children" | "style"> {
  easing?: TransitionEasing | { enter: TransitionEasing; exit: TransitionEasing };
  in?: boolean;
  mountOnEnter?: boolean;
  style?: TransitionStyle;
  timeout?: number | { enter: number; exit: number };
  unmountOnExit?: boolean;
}
