import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import { forwardRef, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { Grow } from "./Grow";
import { mergeRefs } from "./mergeRefs";
import { getAutoHeightDuration } from "./utils";

describe("<Grow />", () => {
  describe("transition lifecycle", () => {
    jest.useFakeTimers();

    it("calls the appropriate callbacks for each transition", async () => {
      const handleEnter = jest.fn();
      const handleEntering = jest.fn();
      const handleEntered = jest.fn();
      const handleExit = jest.fn();
      const handleExiting = jest.fn();
      const handleExited = jest.fn();

      const GrowTest: React.FC<any> = ({ in: inProp = false }) => (
        <Grow
          in={inProp}
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <RNView id="test" />
        </Grow>
      );

      const { container, rerender } = render(<GrowTest />);

      const child = container.querySelector("#test");

      rerender(<GrowTest in />);

      expect(handleEnter).toHaveBeenCalledTimes(1);
      expect(handleEnter).toHaveBeenCalledWith(child);
      expect(handleEnter.mock.calls[0][0].style.transition).toMatch(
        /opacity (0ms )?ease-in-out( 0ms)?,( )?transform (0ms )?ease-in-out( 0ms)?/
      );

      await act(async () => {
        await new Promise((resolve) => {
          requestAnimationFrame(resolve);
        });
        expect(handleEntering).toHaveBeenCalledTimes(1);
        expect(handleEntering).toHaveBeenCalledWith(child);
      });

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 300);
        });
        expect(handleEntered).toHaveBeenCalledTimes(1);
        expect(handleEntered).toHaveBeenCalledWith(child);
      });

      rerender(<GrowTest in={false} />);

      expect(handleExit).toHaveBeenCalledTimes(1);
      expect(handleExit).toHaveBeenCalledWith(child);

      expect(handleExit.mock.calls[0][0].style.opacity).toBe("0");
      expect(handleExit.mock.calls[0][0].style.transform).toBe("scale(0.75, 0.5625)");

      await act(async () => {
        await new Promise((resolve) => {
          requestAnimationFrame(resolve);
        });
        expect(handleExiting).toHaveBeenCalledTimes(1);
        expect(handleExiting).toHaveBeenCalledWith(child);
      });

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 300);
        });
        expect(handleExited).toHaveBeenCalledTimes(1);
        expect(handleExited).toHaveBeenCalledWith(child);
      });
    });

    jest.useRealTimers();
  });

  describe("prop: appear", () => {
    it("should work when initially hidden, appear=true", () => {
      const { container } = render(
        <Grow appear in={false}>
          <Text>Foo</Text>
        </Grow>
      );

      const element = container.querySelector("div");

      expect(element).toHaveStyle({ opacity: "0" });
      expect(element).toHaveStyle({ visibility: "hidden" });
    });

    it("should work when initially hidden, appear=false", () => {
      const { container } = render(
        <Grow in={false} appear={false}>
          <Text>Foo</Text>
        </Grow>
      );

      const element = container.querySelector("div");

      expect(element).toHaveStyle({ opacity: "0" });
      expect(element).toHaveStyle({ visibility: "hidden" });
    });
  });

  describe("prop: timeout", () => {
    const enterDuration = 556;
    const leaveDuration = 446;

    jest.useFakeTimers();

    describe("onEnter", () => {
      it("should create proper easeOut animation", () => {
        const handleEnter = jest.fn();

        render(
          <Grow
            in
            timeout={{
              enter: enterDuration,
              exit: leaveDuration,
            }}
            onEnter={handleEnter}
          >
            <View />
          </Grow>
        );

        expect(handleEnter.mock.calls[0][0].style.transition).toMatch(
          new RegExp(`${enterDuration}ms`)
        );
      });

      it("should delay based on height when timeout is auto", async () => {
        const handleEntered = jest.fn();

        const autoTransitionDuration = 10;

        const FakeView = forwardRef((props, ref) => {
          const viewRef = useRef(null);

          useEffect(() => {
            Object.defineProperty(viewRef.current, "clientHeight", {
              value: autoTransitionDuration,
            });
          });

          return (
            <View
              ref={mergeRefs([viewRef, ref])}
              style={{
                height: autoTransitionDuration,
              }}
              {...props}
            />
          );
        });

        const GrowTest: React.FC<any> = (props) => (
          <Grow timeout="auto" onEntered={handleEntered} {...props}>
            <FakeView />
          </Grow>
        );

        const { rerender } = render(<GrowTest />);

        rerender(<GrowTest in />);

        expect(handleEntered).toHaveBeenCalledTimes(0);

        await act(async () => {
          await new Promise((resolve) => {
            requestAnimationFrame(resolve);
          });
          expect(handleEntered).toHaveBeenCalledTimes(0);
        });

        await act(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, getAutoHeightDuration(autoTransitionDuration));
          });
          expect(handleEntered).toHaveBeenCalledTimes(1);
        });

        const handleEntered2 = jest.fn();

        render(
          <Grow in timeout="auto" onEntered={handleEntered2}>
            <View />
          </Grow>
        );

        expect(handleEntered2).toHaveBeenCalledTimes(0);

        await act(async () => {
          await new Promise((resolve) => {
            requestAnimationFrame(resolve);
          });
          expect(handleEntered2).toHaveBeenCalledTimes(1);
        });
      });

      it("should use timeout as delay when timeout is number", async () => {
        const timeout = 10;
        const handleEntered = jest.fn();

        render(
          <Grow in timeout={timeout} onEntered={handleEntered}>
            <View />
          </Grow>
        );

        expect(handleEntered).toHaveBeenCalledTimes(0);

        await act(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 0);
          });
          expect(handleEntered).toHaveBeenCalledTimes(0);
        });

        await act(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, timeout);
          });
          expect(handleEntered).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("onExit", () => {
      it("should delay based on height when timeout is auto", async () => {
        const handleExited = jest.fn();

        const GrowTest: React.FC<any> = (props) => (
          <Grow in timeout="auto" onExited={handleExited} {...props}>
            <View />
          </Grow>
        );

        const { rerender } = render(<GrowTest />);

        rerender(<GrowTest in={false} />);

        expect(handleExited).toHaveBeenCalledTimes(0);

        await act(async () => {
          await new Promise((resolve) => {
            requestAnimationFrame(resolve);
          });
          expect(handleExited).toHaveBeenCalledTimes(1);
        });
      });

      it("should use timeout as delay when timeout is number", async () => {
        const timeout = 20;
        const handleExited = jest.fn();

        const GrowTest: React.FC<any> = (props) => (
          <Grow in timeout={timeout} onExited={handleExited} {...props}>
            <View />
          </Grow>
        );

        const { rerender } = render(<GrowTest />);

        rerender(<GrowTest in={false} />);

        expect(handleExited).toHaveBeenCalledTimes(0);

        await act(async () => {
          await new Promise((resolve) => {
            requestAnimationFrame(resolve);
          });
          expect(handleExited).toHaveBeenCalledTimes(0);
        });

        await act(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, timeout);
          });
          expect(handleExited).toHaveBeenCalledTimes(1);
        });
      });

      it("should create proper sharp animation", async () => {
        const handleExit = jest.fn();

        const GrowTest: React.FC<any> = (props) => (
          <Grow
            in
            timeout={{
              enter: enterDuration,
              exit: leaveDuration,
            }}
            onExit={handleExit}
            {...props}
          >
            <View />
          </Grow>
        );

        const { rerender } = render(<GrowTest />);

        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });

        rerender(<GrowTest in={false} />);

        expect(handleExit.mock.calls[0][0].style.transition).toMatch(
          new RegExp(`${leaveDuration}ms`)
        );
      });
    });

    jest.useRealTimers();
  });
});
