import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import { Text, View } from "react-native";
import { Zoom } from "./Zoom";
import { ZOOM_TIMEOUT } from "./constants";

describe("<Zoom />", () => {
  describe("transition lifecycle", () => {
    jest.useFakeTimers();

    it("calls the appropriate callbacks for each transition", async () => {
      const handleEnter = jest.fn();
      const handleEntering = jest.fn();
      const handleEntered = jest.fn();
      const handleExit = jest.fn();
      const handleExiting = jest.fn();
      const handleExited = jest.fn();

      const ZoomTest: React.FC<{ in?: boolean }> = ({ in: inProp = false }) => (
        <Zoom
          in={inProp}
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <View id="test" />
        </Zoom>
      );

      const { container, rerender } = render(<ZoomTest />);

      const child = container.querySelector("#test");

      rerender(<ZoomTest in />);

      expect(handleEnter).toHaveBeenCalledTimes(1);
      expect(handleEnter).toHaveBeenCalledWith(child);
      expect(handleEnter.mock.calls[0][0].style.transition).toMatch(
        /transform 225ms ease-in-out( 0ms)?/
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

      rerender(<ZoomTest in={false} />);

      expect(handleExit).toHaveBeenCalledTimes(1);
      expect(handleExit).toHaveBeenCalledWith(child);

      expect(handleExit.mock.calls[0][0].style.transition).toMatch(
        /transform 195ms ease-in-out( 0ms)?/
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
        <Zoom appear in={false}>
          <Text>Foo</Text>
        </Zoom>
      );

      const element = container.querySelector("div");

      expect(element).toHaveStyle({ transform: "scale(0)" });
      expect(element).toHaveStyle({ visibility: "hidden" });
    });

    it("should work when initially hidden, appear=false", () => {
      const { container } = render(
        <Zoom in={false} appear={false}>
          <Text>Foo</Text>
        </Zoom>
      );

      const element = container.querySelector("div");

      expect(element).toHaveStyle({ transform: "scale(0)" });
      expect(element).toHaveStyle({ visibility: "hidden" });
    });
  });

  describe("prop: timeout", () => {
    it("should render the default theme values by default", async () => {
      const { getByTestId } = render(
        <Zoom in appear>
          <Text testID="child">Foo</Text>
        </Zoom>
      );

      const child = getByTestId("child");

      expect(child.style.transition).toMatch(new RegExp(` ${ZOOM_TIMEOUT.enter}ms`));
    });

    it("should render the values provided via prop", () => {
      const { getByTestId } = render(
        <Zoom appear in timeout={{ enter: 1, exit: 1 }}>
          <Text testID="child">Foo</Text>
        </Zoom>
      );

      const child = getByTestId("child");

      expect(child.style.transition).toMatch(/ 1ms/);
    });
  });
});
