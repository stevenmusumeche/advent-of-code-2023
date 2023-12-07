import { expect, test, describe } from "bun:test";
import { run } from "./part1";
import { run as run2 } from "./part2";

describe("part 1", () => {
  test("sample data", async () => {
    expect(await run("sample1.txt")).toBe(35);
  });

  test("real data", async () => {
    expect(await run("real.txt")).toBe(322500873);
  });
});

describe("part 2", () => {
  test("sample data", async () => {
    expect(await run2("sample1.txt")).toBe(46);
  });
  // todo: this is too slow
  // test("real data", async () => {
  //   expect(await run2("real.txt")).toBe(-1);
  // });
});
