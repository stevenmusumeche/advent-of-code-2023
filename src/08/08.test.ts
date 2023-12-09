import { expect, test, describe } from "bun:test";
import { run } from "./part1";
import { run as run2 } from "./part2";

describe("part 1", () => {
  test("sample data", async () => {
    expect(await run("sample1.txt")).toBe(2);
  });
  test("sample data", async () => {
    expect(await run("sample2.txt")).toBe(6);
  });

  test("real data", async () => {
    expect(await run("real.txt")).toBe(14893);
  });
});

describe("part 2", () => {
  test("sample data", async () => {
    expect(await run2("sample3.txt")).toBe(6);
  });

  test("real data", async () => {
    expect(await run2("real.txt")).toBe(10241191004509);
  });
});
