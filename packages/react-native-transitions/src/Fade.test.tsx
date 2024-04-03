import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import { Text as RNText, View as RNView } from "react-native";
import { Fade } from "./Fade";
import { FADE_TIMEOUT } from "./constants";

describe("<Fade />", () => {
  describe("transition lifecycle", () => {
    jest.useFakeTimers();

    it("calls the appropriate callbacks for each transition", async () => {
      const handleEnter = jest.fn();
      const handleEntering = jest.fn();
      const handleEntered = jest.fn();
      const handleExit = jest.fn();
      const handleExiting = jest.fn();
      const handleExited = jest.fn();

      const FadeTest: React.FC<{ in?: boolean }> = ({ in: inProp = false }) => (
        <Fade
          in={inProp}
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <RNView id="test" />
        </Fade>
      );

      const { container, rerender } = render(<FadeTest />);

      const child = container.querySelector("#test");

      rerender(<FadeTest in />);

      expect(handleEnter).toHaveBeenCalledTimes(1);
      expect(handleEnter).toHaveBeenCalledWith(child);
      expect(handleEnter.mock.calls[0][0].style.transition).toMatch(
        /opacity 225ms ease-in-out( 0ms)?/
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
          setTimeout(resolve, 225);
        });
        expect(handleEntered).toHaveBeenCalledTimes(1);
        expect(handleEntered).toHaveBeenCalledWith(child);
      });

      rerender(<FadeTest in={false} />);

      expect(handleExit).toHaveBeenCalledTimes(1);
      expect(handleExit).toHaveBeenCalledWith(child);

      expect(handleExit.mock.calls[0][0].style.transition).toMatch(
        /opacity 195ms ease-in-out( 0ms)?/
      );

      await act(async () => {
        await new Promise((resolve) => {
          requestAnimationFrame(resolve);
        });
        expect(handleExiting).toHaveBeenCalledTimes(1);
        expect(handleExiting).toHaveBeenCalledWith(child);
      });

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 195);
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
        <Fade appear in={false}>
          <RNText>Foo</RNText>
        </Fade>
      );

      const element = container.querySelector("div");

      expect(element).toHaveStyle({ opacity: "0" });
      expect(element).toHaveStyle({ visibility: "hidden" });
    });

    it("should work when initially hidden, appear=false", () => {
      const { container } = render(
        <Fade in={false} appear={false}>
          <RNText>Foo</RNText>
        </Fade>
      );

      const element = container.querySelector("div");

      expect(element).toHaveStyle({ opacity: "0" });
      expect(element).toHaveStyle({ visibility: "hidden" });
    });
  });

  describe("prop: timeout", () => {
    it("should render the default theme values by default", async () => {
      const { getByTestId } = render(
        <Fade in appear>
          <RNText testID="child">Foo</RNText>
        </Fade>
      );

      const child = getByTestId("child");

      expect(child.style.transition).toMatch(
        new RegExp(` ${FADE_TIMEOUT.enter}ms`)
      );
    });

    it("should render the values provided via prop", () => {
      const { getByTestId } = render(
        <Fade appear in timeout={{ enter: 1, exit: 1 }}>
          <RNText testID="child">Foo</RNText>
        </Fade>
      );

      const child = getByTestId("child");

      expect(child.style.transition).toMatch(/ 1ms/);
    });
  });
});
