import { fileContents, invariant } from "../common";
import { getMatches, parseInput } from "./common";

export async function run(filename: string) {
  const raw = await fileContents(import.meta.dir + "/" + filename);
  const originalCards = parseInput(raw);

  const working = [...originalCards.values()];
  const allCards = [];
  while (working.length > 0) {
    const card = working.pop();
    invariant(card, "card should be defined");

    allCards.push(card);
    const numMatches = getMatches(card).size;
    for (let offset = 1; offset <= numMatches; offset++) {
      const cardToCopy = originalCards.get(card.number + offset);
      invariant(cardToCopy, "cardToCopy should be defined");
      working.push(cardToCopy);
    }
  }

  return allCards.length;
}
