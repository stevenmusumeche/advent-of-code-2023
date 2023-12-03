import { expect, test, describe } from "bun:test";
import { run } from "./part1";
import { run as run2 } from "./part2";

describe("part 1", () => {
  test("sample data", async () => {
    expect(await run("sample1.txt")).toBe(4361);
  });

  test("real data", async () => {
    expect(await run("real.txt")).toBe(556367);
  });
});

// describe("part 2", () => {
//   test("sample data", async () => {
//     expect(await run2("sample1.txt")).toBe(2286);
//   });

//   test("real data", async () => {
//     expect(await run2("real.txt")).toBe(63711);
//   });
// });
