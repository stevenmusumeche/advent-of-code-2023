import { expect, test, describe } from "bun:test";
import { run } from "./part2";

test("sample data", async () => {
  expect(await run("part2-sample1.txt")).toBe(281);
});

test("sample data 2", async () => {
  expect(await run("part2-sample2.txt")).toBe(41);
});

test("real data", async () => {
  expect(await run("part2-real.txt")).toBe(54277);
});
