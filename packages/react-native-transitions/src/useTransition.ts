import { useEffect, useState } from "react";
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
  const [resolved, setResolved] = useState(false);

  const handleStateChange = (event: { current: TransitionState }) => {
    switch (event.current.status) {
      case "preEnter": {
        onEnter?.(nodeRef.current!);
        break;
      }
      case "entered": {
        setResolved(true);
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
        setResolved(true);
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

  const [{ isMounted: mounted, status: state }, toggle] = useTransitionState({
    initialEntered: appear ? false : !resolved ? inProp : undefined,
    mountOnEnter,
    onStateChange: handleStateChange,
    preEnter: true,
    preExit: true,
    timeout,
    unmountOnExit,
  });

  useEffect(() => {
    if (appear) {
      toggle(true);
    }
  }, [appear, toggle]);

  useEffect(() => {
    setResolved(true);
    toggle(inProp);
  }, [inProp, toggle]);

  return {
    animation: undefined as any,
    easing: isString(easing) ? easing : inProp ? easing?.exit : easing?.exit,
    mounted,
    resolved,
    state,
  };
}
