import type { TransitionEasing, TransitionStyle } from "./types";

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isNumber(value: any): value is number {
  return !Number.isNaN(Number.parseFloat(value));
}

export function isFunction(value: any): value is Function {
  return typeof value === "function";
}

export function runIfFn<T, U>(
  valueOrFn: T | ((...args: U[]) => T),
  ...args: U[]
): T {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}

export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 166) {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
    }, wait);
  };

  debounced.clear = () => {
    clearTimeout(timeout);
  };

  return debounced as T & { clear: () => void };
}

export function getOwnerWindow(node?: HTMLElement | null) {
  return (node?.ownerDocument ?? document).defaultView ?? window;
}

export function getTransitionProps(
  {
    easing,
    style = {},
    timeout,
  }: {
    easing?:
      | TransitionEasing
      | { enter?: TransitionEasing; exit?: TransitionEasing };
    style?: TransitionStyle;
    timeout: number | { enter?: number; exit?: number };
  },
  options: {
    mode: "enter" | "exit";
  }
) {
  return {
    delay: style.transitionDelay,
    duration:
      style.transitionDuration ??
      (isNumber(timeout) ? timeout : timeout[options.mode] ?? 0),
    easing:
      style.transitionTimingFunction ??
      (isString(easing) ? easing : easing?.[options.mode]),
  };
}

export function formatTime(ms: number) {
  return `${Math.round(ms)}ms`;
}

export function parseTime(value: string | number) {
  const periods: Record<string, number> = { s: 1000, ms: 1 };
  if (isString(value)) {
    return [...value.toLowerCase().matchAll(/(-*\d*\.*\d*)\W*(s|ms)/g)].reduce(
      (acc, [, digits, type]) =>
        periods[type] * Number.parseFloat(digits) + acc,
      0
    );
  }
  return value;
}

export function getAutoHeightDuration(height: number) {
  if (!height) {
    return 0;
  }
  const constant = height / 36;
  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

export function createTransitions(
  props: string | string[] = ["all"],
  {
    delay = 0,
    duration = 300,
    easing = "ease-in-out",
  }: {
    delay?: number | string;
    duration?: number | string;
    easing?: TransitionEasing;
  } = {}
) {
  return (Array.isArray(props) ? props : [props])
    .map((prop) =>
      `${prop} ${
        isString(duration) ? duration : formatTime(duration)
      } ${easing} ${isString(delay) ? delay : formatTime(delay)}`.trim()
    )
    .join(",");
}
