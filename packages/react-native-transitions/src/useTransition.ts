import { useEffect, useRef } from "react";
import type { TransitionState } from "react-transition-state";
import { useTransition as useTransitionState } from "react-transition-state";
import type {
  UseTransitionProps,
  UseTransitionReturn,
} from "./useTransition.types";
import { isString } from "./utils";

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
        onEnter?.(nodeRef.current!);
        break;
      }
      case "entered": {
        onEntered?.(nodeRef.current!);
        break;
      }
      case "entering": {
        onEntering?.(nodeRef.current!);
        break;
      }
      case "preExit": {
        onExit?.(nodeRef.current!);
        break;
      }
      case "exited": {
        onExited?.(nodeRef.current!);
        break;
      }
      case "exiting": {
        onExiting?.(nodeRef.current!);
        break;
      }
      default:
    }
  };

  const initialEntered = inProp ? !appear : false;

  const [{ isMounted: mounted, isResolved: resolved, status: state }, toggle] =
    useTransitionState({
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
        toggle(true);
      } else {
        toggle(false);
      }
      prevIn.current = inProp;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inProp]);

  return {
    animation: undefined as any,
    easing: isString(easing) ? easing : inProp ? easing?.exit : easing?.exit,
    mounted,
    resolved,
    state,
  };
}
