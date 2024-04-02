import type {
  NativeMethods,
  ViewProps as RNViewProps,
  ViewStyle as RNViewStyle,
} from "react-native";

export type TransitionEasing =
  | "ease"
  | "ease-in"
  | "ease-in-out"
  | "ease-out"
  | "linear"
  | (string & {});

export type TransitionStyle = RNViewStyle & {
  transitionDelay?: React.CSSProperties["transitionDelay"];
  transitionDuration?: React.CSSProperties["transitionDuration"];
  transitionTimingFunction?: TransitionEasing;
};

export type TransitionHandlerProps<T> = {
  onEnter?: (node: T) => void;
  onEntered?: (node: T) => void;
  onEntering?: (node: T) => void;
  onExit?: (node: T) => void;
  onExited?: (node: T) => void;
  onExiting?: (node: T) => void;
};

export type TransitionProps = TransitionHandlerProps<
  HTMLElement | NativeMethods
> &
  Omit<RNViewProps, "children" | "style"> & {
    easing?:
      | TransitionEasing
      | { enter: TransitionEasing; exit: TransitionEasing };
    in?: boolean;
    mountOnEnter?: boolean;
    style?: TransitionStyle;
    timeout?: number | { enter: number; exit: number };
    unmountOnExit?: boolean;
  };
