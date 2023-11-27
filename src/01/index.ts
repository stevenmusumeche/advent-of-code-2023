import { fileContents, fileToStringArray } from "../common";

export async function runA(inputPath: string): Promise<unknown> {
  const input = await fileContents(inputPath);

  const elves = parseInput(input);

  let max = 0;
  let maxIndex = 0;

  for (let i = 0; i < elves.length; i++) {
    if (elves[i] > max) {
      max = elves[i];
      maxIndex = i;
    }
  }

  return max;
}

export async function runB(inputPath: string): Promise<unknown> {
  const input = await fileContents(inputPath);

  const elves = parseInput(input).reduce((acc, cur, i) => {
    acc.set(i + 1, cur);
    return acc;
  }, new Map<number, number>());

  const sorted = [...elves.entries()].toSorted(
    ([aIndex, aVal], [bIndex, bVal]) => {
      return bVal - aVal;
    },
  );

  return sorted.slice(0, 3).reduce((acc, [index, val]) => {
    return acc + val;
  }, 0);
}

function parseInput(input: string) {
  return input.split("\n\n").map((food) =>
    food.split("\n").reduce((acc, cur, i) => {
      return (acc += Number(cur));
    }, 0),
  );
}
