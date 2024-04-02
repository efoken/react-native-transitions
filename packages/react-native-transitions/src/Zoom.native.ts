import { Children, cloneElement, forwardRef, useRef } from "react";
import type { ZoomProps } from "./Zoom.types";
import { ZOOM_TIMEOUT } from "./constants";
import { mergeRefs } from "./mergeRefs";
import { useTransition } from "./useTransition";

export const Zoom = forwardRef<any, ZoomProps>(
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
      timeout = ZOOM_TIMEOUT,
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
              transform: [{ scale: animation }],
            },
            style,
            children.props.style,
          ],
          ...props,
        })
      : undefined;
  }
);
