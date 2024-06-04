import type { Animated } from "react-native";
import type {
  TransitionOptions,
  TransitionStatus,
} from "react-transition-state";
import type { TransitionEasing, TransitionHandlerProps } from "./types";

export interface UseTransitionProps<T>
  extends Pick<TransitionOptions, "mountOnEnter" | "timeout" | "unmountOnExit">,
    TransitionHandlerProps<T> {
  appear?: boolean;
  disableNativeDriver?: boolean;
  easing?:
    | TransitionEasing
    | { enter: TransitionEasing; exit: TransitionEasing };
  in?: boolean;
  nodeRef: React.RefObject<T>;
}

export interface UseTransitionReturn {
  animation: Animated.Value;
  easing?: TransitionEasing;
  mounted: boolean;
  resolved: boolean;
  state: TransitionStatus;
}
