import { useEffect, useRef } from "react";
import type { EasingFunction } from "react-native";
import type { TransitionState } from "react-transition-state";
import { useTransitionState } from "react-transition-state";
import type { TransitionEasing } from "./types";
import type { UseTransitionProps, UseTransitionReturn } from "./useTransition.types";
import { isString } from "./utils";

export function getEasing(easing: TransitionEasing | undefined): EasingFunction {
  return easing as any;
}

export function useTransition<T>({
  appear,
  easing,
  in: inProp,
  mountOnEnter,
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
  const handleStateChange = (event: { current: TransitionState }) => {
    switch (event.current.status) {
      case "preEnter": {
        if (nodeRef.current) {
          onEnter?.(nodeRef.current);
        }
        break;
      }
      case "entered": {
        onEntered?.(nodeRef.current!);
        break;
      }
      case "entering": {
        if (nodeRef.current) {
          onEntering?.(nodeRef.current);
        }
        break;
      }
      case "preExit": {
        if (nodeRef.current) {
          onExit?.(nodeRef.current);
        }
        break;
      }
      case "exited": {
        onExited?.(nodeRef.current!);
        break;
      }
      case "exiting": {
        if (nodeRef.current) {
          onExiting?.(nodeRef.current!);
        }
        break;
      }
      default:
    }
  };

  const initialEntered = inProp ? !appear : false;

  const [{ isMounted: mounted, isResolved: resolved, status: state }, toggle] = useTransitionState({
    initialEntered,
    mountOnEnter,
    onStateChange: handleStateChange,
    preEnter: true,
    preExit: true,
    timeout,
    unmountOnExit,
  });

  const prevIn = useRef<boolean>();

  useEffect(() => {
    if (inProp !== prevIn.current) {
      if (inProp) {
        setTimeout(() => toggle(true), 0);
      } else {
        toggle(false);
      }
      prevIn.current = inProp;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inProp]);

  return {
    animation: undefined as any,
    easing: isString(easing) ? easing : inProp ? easing?.enter : easing?.exit,
    mounted,
    resolved,
    state,
  };
}
