import { Children, cloneElement, forwardRef, useEffect, useMemo, useRef, useState } from "react";
import type { Animated, LayoutRectangle, NativeMethods, ScaledSize } from "react-native";
import { useWindowDimensions } from "react-native";
import type { SlideDirection, SlideProps } from "./Slide.types";
import { SLIDE_TIMEOUT } from "./constants";
import { mergeRefs } from "./mergeRefs";
import { useTransition } from "./useTransition";
import { isNumber, runIfFn } from "./utils";

function getTranslateValue(
  animation: Animated.Value,
  direction: SlideDirection,
  node: { layout: LayoutRectangle; offset: { x: number; y: number } },
  containerWindow: ScaledSize
) {
  if (direction === "left") {
    return [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [containerWindow.width + node.offset.x - node.layout.x, 0],
        }),
      },
    ];
  }

  if (direction === "right") {
    return [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-(node.layout.x + node.layout.width - node.offset.x), 0],
        }),
      },
    ];
  }

  if (direction === "up") {
    return [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [containerWindow.height + node.offset.y - node.layout.y, 0],
        }),
      },
    ];
  }

  // direction === 'down'
  return [
    {
      translateY: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-(node.layout.y + node.layout.height - node.offset.y), 0],
        extrapolate: "extend",
      }),
    },
  ];
}

function isValidLayout(layout: LayoutRectangle) {
  return Math.max(layout.x, layout.y, layout.width, layout.height) > 0;
}

export const Slide = forwardRef<any, SlideProps>(
  (
    {
      appear = true,
      children,
      container: containerProp,
      direction = "down",
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
      timeout = SLIDE_TIMEOUT,
      unmountOnExit = false,
      ...props
    },
    ref
  ) => {
    const nodeRef = useRef<NativeMethods>(null);

    const container = runIfFn(containerProp);
    const containerWindow = useWindowDimensions();

    const [layout, setLayout] = useState<LayoutRectangle>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });

    const offset = useMemo(
      () =>
        (Array.isArray(style?.transform) ? style.transform : []).reduce(
          (acc, value) => ({
            x: acc.x + (isNumber(value.translateX) ? value.translateX : 0),
            y: acc.y + (isNumber(value.translateY) ? value.translateY : 0),
          }),
          { x: 0, y: 0 }
        ),
      [style]
    );

    useEffect(() => {
      if (!isValidLayout(layout)) {
        if (container) {
          // @ts-expect-error
          nodeRef.current?.measureLayout(container, (x, y, width, height) => {
            setLayout({ x, y, width, height });
          });
        } else {
          nodeRef.current?.measureInWindow((x, y, width, height) => {
            setLayout({ x, y, width, height });
          });
        }
      }
    }, [container, layout]);

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
              opacity: isValidLayout(layout) ? 1 : 0,
              transform: getTranslateValue(
                animation,
                direction,
                { layout, offset },
                containerWindow
              ),
            },
            style,
            children.props.style,
          ],
          ...props,
        })
      : undefined;
  }
);
