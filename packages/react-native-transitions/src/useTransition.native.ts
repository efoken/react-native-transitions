import { useEffect, useRef, useState } from "react";
import { Animated, Easing, useAnimatedValue } from "react-native";
import type { TransitionStatus } from "react-transition-state";
import type { TransitionEasing } from "./types";
import type {
  UseTransitionProps,
  UseTransitionReturn,
} from "./useTransition.types";
import { isNumber, isString } from "./utils";

function getEasing(easing: TransitionEasing | undefined) {
  if (easing === "linear") {
    return Easing.linear;
  }
  if (easing === "ease-in") {
    return Easing.in(Easing.ease);
  }
  if (easing === "ease-in-out") {
    return Easing.inOut(Easing.ease);
  }
  if (easing === "ease-out") {
    return Easing.out(Easing.ease);
  }
  if (easing?.startsWith("cubic-bezier(")) {
    const args = (
      easing.match(/cubic-bezier\((.*)\)/)?.[1]?.split(/,\s*/, 4) ?? []
    ).map((arg) => Number.parseFloat(arg)) as [
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ];
    return Easing.bezier(...args);
  }
  return Easing.ease;
}

export function useTransition<T>({
  appear,
  disableNativeDriver,
  easing: easingProp,
  in: inProp,
  nodeRef,
  onEnter,
  onEntered,
  onEntering,
  onExit,
  onExited,
  onExiting,
  timeout,
  unmountOnExit,
}: UseTransitionProps<T>): UseTransitionReturn {
  const [state, setState] = useState<TransitionStatus>("unmounted");

  const easing = isString(easingProp)
    ? easingProp
    : inProp
    ? easingProp?.exit
    : easingProp?.exit;

  const animatedValue = useAnimatedValue(
    appear ? (inProp ? 0 : 1) : inProp ? 1 : 0
  );
  const animation = useRef<Animated.CompositeAnimation>();

  useEffect(() => {
    if (inProp) {
      setState("preEnter");
      onEnter?.(nodeRef.current!);
    } else {
      setState("preExit");
      onExit?.(nodeRef.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inProp, onEnter, onExit]);

  const handleAnimationStart = () => {
    if (inProp) {
      setState("entering");
      onEntering?.(nodeRef.current!);
    } else {
      setState("exiting");
      onExiting?.(nodeRef.current!);
    }
  };

  const handleAnimationEnd = (result: Animated.EndResult) => {
    if (result.finished) {
      if (inProp) {
        setState("entered");
        onEntered?.(nodeRef.current!);
      } else {
        setState("exited");
        onExited?.(nodeRef.current!);
      }
    }
  };

  useEffect(() => {
    animation.current?.stop();
    handleAnimationStart();
    animation.current = Animated.timing(animatedValue, {
      duration: isNumber(timeout)
        ? timeout
        : inProp
        ? timeout?.exit
        : timeout?.enter,
      easing: getEasing(easing),
      toValue: inProp ? 1 : 0,
      useNativeDriver: !disableNativeDriver,
    });
    animation.current.start(handleAnimationEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedValue, disableNativeDriver, easing, inProp, timeout, state]);

  return {
    animation: animatedValue,
    easing,
    mounted: state !== "exited" || !unmountOnExit,
    resolved: true,
    state,
  };
}
