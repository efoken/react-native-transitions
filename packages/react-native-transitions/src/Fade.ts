import { Children, cloneElement, forwardRef, useRef } from "react";
import type { ViewStyle as RNViewStyle } from "react-native";
import type { FadeProps } from "./Fade.types";
import { FADE_TIMEOUT } from "./constants";
import { mergeRefs } from "./mergeRefs";
import { useTransition } from "./useTransition";
import { createTransitions, getTransitionProps, objectFlat } from "./utils";

const styles: Record<string, RNViewStyle> = {
  entering: {
    opacity: 1,
  },
  entered: {
    opacity: 1,
  },
};

export const Fade = forwardRef<any, FadeProps>(
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
      timeout = FADE_TIMEOUT,
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

      node.style.transition = createTransitions("opacity", transitionProps);

      onEnter?.(node);
    };

    const handleExit = (node: HTMLElement) => {
      const transitionProps = getTransitionProps(
        { easing, style, timeout },
        { mode: "exit" }
      );

      node.style.transition = createTransitions("opacity", transitionProps);

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
          style: objectFlat([
            {
              opacity: 0,
              transform: "none",
              visibility: state === "exited" && !inProp ? "hidden" : undefined,
              willChange: "opacity",
              ...styles[state],
            },
            style,
            children.props.style,
          ]),
          ...props,
        })
      : undefined;
  }
);
