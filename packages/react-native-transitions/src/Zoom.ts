import { Children, cloneElement, forwardRef, useRef } from "react";
import type { ViewStyle as RNViewStyle } from "react-native";
import type { ZoomProps } from "./Zoom.types";
import { ZOOM_TIMEOUT } from "./constants";
import { mergeRefs } from "./mergeRefs";
import { useTransition } from "./useTransition";
import { createTransitions, getTransitionProps } from "./utils";

const styles: Record<string, RNViewStyle> = {
  entering: {
    transform: "none",
  },
  entered: {
    transform: "none",
  },
};

export const Zoom = forwardRef<any, ZoomProps>(
  (
    {
      appear = true,
      children,
      disableNativeDriver,
      easing,
      in: inProp = false,
      mountOnEnter = false,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      style,
      timeout = ZOOM_TIMEOUT,
      unmountOnExit = false,
      ...props
    },
    ref
  ) => {
    const nodeRef = useRef<HTMLElement>(null);

    const handleEnter = (node: HTMLElement) => {
      const transitionProps = getTransitionProps(
        { easing, style, timeout },
        { mode: "enter" }
      );

      node.style.transition = createTransitions("transform", transitionProps);

      onEnter?.(node);
    };

    const handleExit = (node: HTMLElement) => {
      const transitionProps = getTransitionProps(
        { easing, style, timeout },
        { mode: "exit" }
      );

      node.style.transition = createTransitions("transform", transitionProps);

      onExit?.(node);
    };

    const { mounted, state } = useTransition({
      appear,
      easing,
      in: inProp,
      mountOnEnter,
      nodeRef,
      onEnter: handleEnter,
      onEntered,
      onEntering,
      onExit: handleExit,
      onExited,
      onExiting,
      timeout,
      unmountOnExit,
    });

    return mounted
      ? cloneElement(Children.only(children), {
          ref: mergeRefs([nodeRef, (children as any).ref, ref]),
          style: [
            {
              transform: "scale(0)",
              visibility: state === "exited" && !inProp ? "hidden" : undefined,
              willChange: "transform",
              ...styles[state],
            },
            style,
            children.props.style,
          ],
          ...props,
        })
      : undefined;
  }
);
