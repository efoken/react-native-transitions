import { Component, createRef, forwardRef } from "react";
import type { LayoutChangeEvent } from "react-native";
import { Animated, View } from "react-native";
import type { CollapseProps } from "./Collapse.types";
import { COLLAPSE_TIMEOUT } from "./constants";
import { getEasing } from "./useTransition";
import { isNumber, isString } from "./utils";

interface CollapseBaseProps extends CollapseProps {
  collapsedSize: number;
  easing: NonNullable<CollapseProps["easing"]>;
  in: boolean;
  innerRef: React.Ref<any>;
  orientation: NonNullable<CollapseProps["orientation"]>;
  timeout: NonNullable<CollapseProps["timeout"]>;
  unmountOnExit: boolean;
}

interface CollapseBaseState {
  animating: boolean;
  animation: Animated.Value;
  measured: boolean;
  measuring: boolean;
  wrapperSize: number;
}

class CollapseBase extends Component<CollapseBaseProps, CollapseBaseState> {
  static defaultProps: Partial<CollapseBaseProps> = {
    collapsedSize: 0,
    easing: "ease-in-out",
    in: false,
    orientation: "vertical",
    timeout: COLLAPSE_TIMEOUT,
    unmountOnExit: false,
  };

  #animation?: Animated.CompositeAnimation;

  #unmounted = false;

  #wrapperRef = createRef<View>();

  constructor(props: CollapseBaseProps) {
    super(props);
    this.state = {
      animating: false,
      animation: new Animated.Value(props.collapsedSize),
      measured: false,
      measuring: false,
      wrapperSize: 0,
    };
  }

  componentDidUpdate(prevProps: CollapseBaseProps) {
    const { in: inProp } = this.props;
    if (prevProps.in !== inProp) {
      this.setState({ measured: false }, () => this.#update(prevProps));
    } else {
      this.#update(prevProps);
    }
  }

  componentWillUnmount() {
    this.#unmounted = true;
  }

  #handleLayoutChange = (event: LayoutChangeEvent) => {
    const { in: inProp, orientation } = this.props;
    const { animating, animation, measuring, wrapperSize: prevWrapperSize } = this.state;

    const wrapperSize =
      orientation === "horizontal"
        ? event.nativeEvent.layout.width
        : event.nativeEvent.layout.height;

    if (animating || !inProp || measuring || prevWrapperSize === wrapperSize) {
      return;
    }

    animation.setValue(wrapperSize);
    this.setState({ wrapperSize });
  };

  #update(prevProps: CollapseBaseProps) {
    const { collapsedSize, in: inProp } = this.props;
    const { animation } = this.state;

    if (prevProps.in !== inProp) {
      this.#toggle(inProp);
    } else if (!inProp && prevProps.collapsedSize !== collapsedSize) {
      animation.setValue(collapsedSize);
    }
  }

  #measureContent(callback: (size: number) => void) {
    this.setState({ measuring: true }, () => {
      requestAnimationFrame(() => {
        const { collapsedSize, orientation } = this.props;

        if (this.#wrapperRef.current) {
          this.#wrapperRef.current.measure((_x, _y, width, height) => {
            const wrapperSize = orientation === "horizontal" ? width : height;
            this.setState({ measured: true, measuring: false, wrapperSize }, () =>
              callback(wrapperSize)
            );
          });
        } else {
          this.setState({ measuring: false }, () => callback(collapsedSize));
        }
      });
    });
  }

  #toggle(inProp: boolean) {
    const { collapsedSize } = this.props;
    const { measured, wrapperSize } = this.state;

    if (inProp) {
      if (this.#wrapperRef.current) {
        this.#measureContent((nextContentHeight) => {
          this.#transitionToSize(nextContentHeight);
        });
      } else if (measured) {
        this.#transitionToSize(wrapperSize);
      }
    } else {
      this.#transitionToSize(collapsedSize);
    }
  }

  #transitionToSize(size: number) {
    const {
      easing: easingProp,
      in: inProp,
      onEntered,
      onEntering,
      onExited,
      onExiting,
      timeout,
    } = this.props;
    const { animation } = this.state;

    const easing = getEasing(
      isString(easingProp) ? easingProp : inProp ? easingProp?.enter : easingProp?.exit
    );
    const duration =
      timeout === "auto"
        ? undefined
        : isNumber(timeout)
        ? timeout
        : inProp
        ? timeout?.enter
        : timeout?.exit;

    this.#animation?.stop();
    this.setState({ animating: true });
    this.#animation = Animated.timing(animation, {
      duration,
      easing,
      toValue: size,
      useNativeDriver: false,
    });
    if (this.#wrapperRef.current) {
      if (inProp) {
        onEntering?.(this.#wrapperRef.current);
      } else {
        onExiting?.(this.#wrapperRef.current);
      }
    }
    this.#animation.start(() => {
      if (this.#unmounted) {
        return;
      }
      this.setState({ animating: false }, () => {
        if (this.#unmounted) {
          return;
        }
        if (this.#wrapperRef.current) {
          if (inProp) {
            onEntered?.(this.#wrapperRef.current);
          } else {
            onExited?.(this.#wrapperRef.current);
          }
        }
      });
    });
  }

  render() {
    const {
      children,
      collapsedSize,
      easing,
      in: inProp,
      innerRef,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      orientation,
      style,
      timeout,
      unmountOnExit,
      ...props
    } = this.props;
    const { animating, animation, measured, measuring, wrapperSize } = this.state;

    const size = orientation === "horizontal" ? "width" : "height";
    const hasKnownSize = !measuring && (measured || !inProp);

    const shouldRenderChildren =
      !unmountOnExit ||
      ((inProp || (!inProp && animating)) && (animating || measuring || measured));

    return (
      <Animated.View
        ref={innerRef}
        pointerEvents={inProp ? "auto" : "none"}
        style={[
          hasKnownSize && { [size]: animation, overflow: "hidden" },
          orientation === "horizontal" ? { minWidth: collapsedSize } : { minHeight: collapsedSize },
        ]}
        {...props}
      >
        <Animated.View
          ref={this.#wrapperRef}
          style={[
            style,
            measuring && {
              opacity: 0,
              position: "absolute",
            },
            orientation === "horizontal"
              ? {
                  transform: [
                    {
                      translateX: animation.interpolate({
                        inputRange: [0, wrapperSize],
                        outputRange: [-wrapperSize, 0],
                      }),
                    },
                  ],
                }
              : {
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, wrapperSize],
                        outputRange: [-wrapperSize, 0],
                      }),
                    },
                  ],
                },
            animating && { [size]: wrapperSize },
          ]}
          onLayout={animating ? undefined : this.#handleLayoutChange}
        >
          <View>{shouldRenderChildren && children}</View>
        </Animated.View>
      </Animated.View>
    );
  }
}

export const Collapse = forwardRef<any, CollapseProps>((props, ref) => (
  <CollapseBase innerRef={ref} {...props} />
));
