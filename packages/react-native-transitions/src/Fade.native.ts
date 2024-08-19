import { Children, cloneElement, forwardRef, useRef } from "react";
import type { NativeMethods } from "react-native";
import type { FadeProps } from "./Fade.types";
import { FADE_TIMEOUT } from "./constants";
import { mergeRefs } from "./mergeRefs";
import { useTransition } from "./useTransition";

export const Fade = forwardRef<any, FadeProps>(
  (
    {
      appear = true,
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
      timeout = FADE_TIMEOUT,
      unmountOnExit = false,
      ...props
    },
    ref
  ) => {
    const nodeRef = useRef<NativeMethods>(null);

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
              transform: [],
            },
            style,
            children.props.style,
          ],
          ...props,
        })
      : undefined;
  }
);
