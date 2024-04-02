import {
  Children,
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type { SlideDirection, SlideProps } from "./Slide.types";
import { SLIDE_TIMEOUT } from "./constants";
import { mergeRefs } from "./mergeRefs";
import { useTransition } from "./useTransition";
import {
  createTransitions,
  debounce,
  getOwnerWindow,
  getTransitionProps,
  isString,
  runIfFn,
} from "./utils";

function getTranslateValue(
  direction: SlideDirection,
  node: HTMLElement,
  container?: HTMLElement
) {
  const rect = node.getBoundingClientRect();
  const containerRect = container?.getBoundingClientRect();
  const containerWindow = getOwnerWindow(node);

  const transform = containerWindow
    .getComputedStyle(node)
    .getPropertyValue("transform");

  let offsetX = 0;
  let offsetY = 0;

  if (transform && isString(transform) && transform !== "none") {
    const transformValues = transform.split("(")[1].split(")")[0].split(",");
    offsetX = Number.parseInt(transformValues[4], 10);
    offsetY = Number.parseInt(transformValues[5], 10);
  }

  if (direction === "left") {
    if (containerRect) {
      return `translateX(${containerRect.right + offsetX - rect.left}px)`;
    }
    return `translateX(${containerWindow.innerWidth + offsetX - rect.left}px)`;
  }

  if (direction === "right") {
    if (containerRect) {
      return `translateX(-${rect.right - containerRect.left - offsetX}px)`;
    }
    return `translateX(-${rect.left + rect.width - offsetX}px)`;
  }

  if (direction === "up") {
    if (containerRect) {
      return `translateY(${containerRect.bottom + offsetY - rect.top}px)`;
    }
    return `translateY(${containerWindow.innerHeight + offsetY - rect.top}px)`;
  }

  // direction === 'down'
  if (containerRect) {
    return `translateY(-${
      rect.top - containerRect.top + rect.height - offsetY
    }px)`;
  }
  return `translateY(-${rect.top + rect.height - offsetY}px)`;
}

export const Slide = forwardRef<any, SlideProps>(
  (
    {
      appear = false,
      children,
      container: containerProp,
      direction = "down",
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
      timeout = SLIDE_TIMEOUT,
      unmountOnExit = false,
      ...props
    },
    ref
  ) => {
    const nodeRef = useRef<HTMLElement>(null);

    const container = runIfFn(containerProp);

    const handleEnter = (node: HTMLElement) => {
      node.style.transform = getTranslateValue(direction, node);

      onEnter?.(node);
    };

    const handleEntering = (node: HTMLElement) => {
      const transitionProps = getTransitionProps(
        { easing, style, timeout },
        { mode: "enter" }
      );

      node.style.transition = createTransitions("transform", transitionProps);
      node.style.transform = "none";

      onEntering?.(node);
    };

    const handleExit = (node: HTMLElement) => {
      const transitionProps = getTransitionProps(
        { easing, style, timeout },
        { mode: "exit" }
      );

      node.style.transition = createTransitions("transform", transitionProps);
      node.style.transform = getTranslateValue(direction, node);

      onExit?.(node);
    };

    const handleExited = (node: HTMLElement) => {
      node.style.transition = "";

      onExited?.(node);
    };

    const updatePosition = useCallback(() => {
      if (nodeRef.current) {
        nodeRef.current.style.transform = getTranslateValue(
          direction,
          nodeRef.current,
          // @ts-expect-error
          container
        );
      }
    }, [container, direction]);

    useEffect(() => {
      // Skip configuration where the position is screen size invariant.
      if (inProp || direction === "down" || direction === "right") {
        return () => {};
      }

      const handleResize = debounce(() => {
        if (nodeRef.current) {
          nodeRef.current.style.transform = getTranslateValue(
            direction,
            nodeRef.current,
            // @ts-expect-error
            container
          );
        }
      });

      const containerWindow = getOwnerWindow(nodeRef.current);
      containerWindow.addEventListener("resize", handleResize);
      return () => {
        handleResize.clear();
        containerWindow.removeEventListener("resize", handleResize);
      };
    }, [container, direction, inProp]);

    useEffect(() => {
      if (!inProp) {
        // We need to update the position of the View when the direction changes
        // and when it's hidden.
        updatePosition();
      }
    }, [inProp, updatePosition]);

    const { mounted, state } = useTransition({
      appear,
      easing,
      in: inProp,
      mountOnEnter,
      nodeRef,
      onEnter: handleEnter,
      onEntered,
      onEntering: handleEntering,
      onExit: handleExit,
      onExited: handleExited,
      onExiting,
      timeout,
      unmountOnExit,
    });

    return mounted
      ? cloneElement(Children.only(children), {
          ref: mergeRefs([nodeRef, (children as any).ref, ref]),
          style: [
            {
              visibility: state === "exited" && !inProp ? "hidden" : undefined,
              willChange: "transition",
            },
            style,
            children.props.style,
          ],
          ...props,
        })
      : undefined;
  }
);
