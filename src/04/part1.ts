import { fileContents, intersection } from "../common";
import { parseInput } from "./common";

export async function run(filename: string) {
  const raw = await fileContents(import.meta.dir + "/" + filename);
  const cards = [...parseInput(raw).values()];

  return cards.reduce((acc, cur) => {
    const matches = intersection(cur.winningNumbers, cur.myNumbers);
    if (matches.size === 0) return acc;
    return acc + 2 ** (matches.size - 1);
  }, 0);
}
