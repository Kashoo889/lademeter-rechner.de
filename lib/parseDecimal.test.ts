import { describe, expect, it } from "vitest";
import { parseDecimal } from "./parseDecimal";

describe("parseDecimal", () => {
  it.each([
    ["1,2", 1.2],
    ["1.2", 1.2],
    ["120", 120],
    ["1.200", 1200],
    ["1.200,5", 1200.5],
    ["12.000.000", 12000000],
    ["1 200", 1200],
    [" 0,8 ", 0.8],
    [",5", 0.5],
    ["1.25", 1.25],
  ])("parses %s as %d", (raw, expected) => {
    expect(parseDecimal(raw)).toBe(expected);
  });

  it.each(["", "  ", "abc", "1,2,3", "1..2", null, undefined])("returns null for %s", (raw) => {
    expect(parseDecimal(raw as string)).toBeNull();
  });
});
