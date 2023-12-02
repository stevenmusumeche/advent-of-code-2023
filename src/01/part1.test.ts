import { expect, test, describe } from "bun:test";
import { run } from "./part1";

test("sample data", async () => {
  expect(await run("part1-sample1.txt")).toBe(142);
});

test("real data", async () => {
  expect(await run("part1-real.txt")).toBe(54390);
});
