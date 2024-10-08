import { Children, cloneElement, forwardRef, useRef } from "react";
import type { ViewStyle } from "react-native";
import type { GrowProps } from "./Grow.types";
import { mergeRefs } from "./mergeRefs";
import { useTransition } from "./useTransition";
import {
  createTransitions,
  getAutoHeightDuration,
  getTransitionProps,
  isNumber,
  objectFlat,
} from "./utils";

function getScale(value: number) {
  return `scale(${value}, ${value ** 2})`;
}

const styles: Record<string, ViewStyle> = {
  entering: {
    opacity: 1,
    transform: getScale(1),
  },
  entered: {
    opacity: 1,
    transform: "none",
  },
};

export const Grow = forwardRef<any, GrowProps>(
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
      timeout = "auto",
      unmountOnExit = false,
      ...props
    },
    ref
  ) => {
    const nodeRef = useRef<HTMLElement>(null);

    const getTimeout = (node: HTMLElement | null) =>
      timeout === "auto" ? getAutoHeightDuration(node?.clientHeight) : timeout;

    const handleEnter = (node: HTMLElement) => {
      const { delay, duration, ...transitionProps } = getTransitionProps(
        { easing, style, timeout: getTimeout(node) },
        { mode: "enter" }
      );

      node.style.transition = [
        createTransitions("opacity", { delay, duration }),
        createTransitions("transform", {
          delay,
          duration: isNumber(duration) ? duration * 0.666 : `calc(${duration} * 0.666)`,
          ...transitionProps,
        }),
      ].join(",");

      onEnter?.(node);
    };

    const handleExit = (node: HTMLElement) => {
      const { delay, duration, ...transitionProps } = getTransitionProps(
        { easing, style, timeout: getTimeout(node) },
        { mode: "exit" }
      );

      node.style.transition = [
        createTransitions("opacity", { delay, duration }),
        createTransitions("transform", {
          delay: delay ?? (isNumber(duration) ? duration * 0.333 : `calc(${duration} * 0.333)`),
          duration: isNumber(duration) ? duration * 0.666 : `calc(${duration} * 0.666)`,
          ...transitionProps,
        }),
      ].join(",");
      node.style.opacity = "0";
      node.style.transform = getScale(0.75);

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
      timeout: getTimeout(nodeRef.current),
      unmountOnExit,
    });

    return mounted
      ? cloneElement(Children.only(children), {
          ref: mergeRefs([nodeRef, (children as any).ref, ref]),
          style: objectFlat([
            {
              opacity: 0,
              transform: getScale(0.75),
              visibility: state === "exited" && !inProp ? "hidden" : undefined,
              willChange: "opacity, transform",
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
