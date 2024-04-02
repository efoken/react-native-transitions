import { Children, cloneElement, forwardRef, useRef } from "react";
import type { GrowProps } from "./Grow.types";
import { GROW_TIMEOUT } from "./constants";
import { mergeRefs } from "./mergeRefs";
import { useTransition } from "./useTransition";

export const Grow = forwardRef<any, GrowProps>(
  (
    {
      appear = false,
      children,
      disableNativeDriver = false,
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
      timeout = GROW_TIMEOUT,
      unmountOnExit = false,
      ...props
    },
    ref
  ) => {
    const nodeRef = useRef<any>(null);

    const { animation, mounted } = useTransition({
      appear,
      disableNativeDriver,
      easing: style?.transitionTimingFunction ?? easing,
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
    });

    return mounted
      ? cloneElement(Children.only(children), {
          ref: mergeRefs([nodeRef, (children as any).ref, ref]),
          collapsable: false,
          style: [
            {
              opacity: animation,
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.75, 1],
                  }),
                },
              ],
            },
            style,
            children.props.style,
          ],
          ...props,
        })
      : undefined;
  }
);
