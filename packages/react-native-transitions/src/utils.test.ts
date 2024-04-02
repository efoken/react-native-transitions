import { parseTime, isNumber, isString } from "./utils";

describe("isString", () => {
  it("should return expected values", () => {
    expect(isString(1)).toBe(false);
    expect(isString("1")).toBe(true);
    expect(isString(null)).toBe(false);
  });
});

describe("isNumber", () => {
  it("should return expected values", () => {
    expect(isNumber(1)).toBe(true);
  });
});

describe("getDuration", () => {
  it("should return expected values", () => {
    expect(parseTime(1)).toBe(1);
    expect(parseTime(10)).toBe(10);
    expect(parseTime("1s")).toBe(1000);
    expect(parseTime("10s")).toBe(10_000);
    expect(parseTime("100s")).toBe(100_000);
    expect(parseTime("1ms")).toBe(1);
    expect(parseTime("10ms")).toBe(10);
    expect(parseTime("100ms")).toBe(100);
    expect(parseTime("1000ms")).toBe(1000);
    expect(parseTime("1m")).toBe(0);
  });
});
