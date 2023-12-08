import { expect, test, describe } from "bun:test";
import { run } from "./part1";
import { run as run2 } from "./part2";

describe("part 1", () => {
  test("sample data", async () => {
    expect(await run("sample1.txt")).toBe(6440);
  });

  test("real data", async () => {
    expect(await run("real.txt")).toBe(251287184);
  });
});

describe("part 2", () => {
  test("sample data", async () => {
    expect(await run2("sample1.txt")).toBe(5905);
  });

  test("real data", async () => {
    expect(await run2("real.txt")).toBe(250757288);
  });
});
