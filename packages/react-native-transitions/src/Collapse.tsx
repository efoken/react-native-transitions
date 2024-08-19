import { forwardRef, useRef } from "react";
import type { ViewStyle } from "react-native";
import type { CollapseProps } from "./Collapse.types";
import { COLLAPSE_TIMEOUT } from "./constants";
import { mergeRefs } from "./mergeRefs";
import { useTransition } from "./useTransition";
import { createTransitions, getAutoHeightDuration, getTransitionProps, objectFlat } from "./utils";

const styles: Record<"horizontal" | "vertical", Record<string, ViewStyle>> = {
  vertical: {
    entered: {
      height: "auto",
      overflow: "visible",
    },
  },
  horizontal: {
    entered: {
      width: "auto",
    },
  },
};

export const Collapse = forwardRef<any, CollapseProps>(
  (
    {
      children,
      collapsedSize = 0,
      easing,
      in: inProp = false,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      orientation = "vertical",
      style,
      timeout = COLLAPSE_TIMEOUT,
      unmountOnExit = false,
      ...props
    },
    ref
  ) => {
    const nodeRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const size = orientation === "horizontal" ? "width" : "height";

    const getWrapperSize = () =>
      wrapperRef.current
        ? wrapperRef.current[orientation === "horizontal" ? "clientWidth" : "clientHeight"]
        : 0;

    const getTimeout = () =>
      timeout === "auto" ? getAutoHeightDuration(getWrapperSize()) : timeout;

    const handleEnter = (node: HTMLElement) => {
      if (wrapperRef.current && orientation === "horizontal") {
        // Set absolute position to get the size of collapsed content
        wrapperRef.current.style.position = "absolute";
      }
      node.style[size] = `${collapsedSize}px`;

      onEnter?.(node);
    };

    const handleEntering = (node: HTMLElement) => {
      if (wrapperRef.current && orientation === "horizontal") {
        // After the size is read reset the position back to default
        wrapperRef.current.style.position = "";
      }

      const transitionProps = getTransitionProps(
        { easing, style, timeout: getTimeout() },
        { mode: "enter" }
      );

      node.style.transition = createTransitions("transform", transitionProps);
      node.style.transitionProperty = size;
      node.style[size] = `${getWrapperSize()}px`;

      onEntering?.(node);
    };

    const handleExit = (node: HTMLElement) => {
      node.style[size] = `${getWrapperSize()}px`;

      onExit?.(node);
    };

    const handleExiting = (node: HTMLElement) => {
      const transitionProps = getTransitionProps(
        { easing, style, timeout: getTimeout() },
        { mode: "exit" }
      );

      node.style.transition = createTransitions("transform", transitionProps);
      node.style.transitionProperty = size;
      node.style[size] = `${collapsedSize}px`;

      onExiting?.(node);
    };

    const handleExited = (node: HTMLElement) => {
      onExited?.(node);
    };

    const { state } = useTransition({
      easing,
      in: inProp,
      mountOnEnter: false,
      nodeRef,
      onEnter: handleEnter,
      onEntered,
      onEntering: handleEntering,
      onExit: handleExit,
      onExited: handleExited,
      onExiting: handleExiting,
      timeout: timeout === "auto" ? undefined : timeout,
      unmountOnExit,
    });

    return (
      <div
        ref={mergeRefs([nodeRef, ref])}
        style={objectFlat([
          {
            overflow: "hidden",
            visibility: state === "exited" && !inProp && collapsedSize === 0 ? "hidden" : undefined,
          },
          orientation === "horizontal"
            ? {
                minWidth: collapsedSize,
                transitionProperty: "width",
                width: 0,
              }
            : {
                height: 0,
                minHeight: collapsedSize,
                transitionProperty: "height",
              },
          styles[orientation][state],
          style,
        ])}
        {...props}
      >
        <div
          ref={wrapperRef}
          style={{
            display: "flex",
            width: "100%",
            ...(orientation === "horizontal" && {
              height: "100%",
              width: "auto",
            }),
          }}
        >
          <div
            style={{
              width: "100%",
              ...(orientation === "horizontal" && {
                height: "100%",
                width: "auto",
              }),
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
