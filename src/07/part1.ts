import { fileToStringArray, invariant } from "../common";
import { Hand, HandType, handValues } from "./common";

export async function run(filename: string) {
  const hands = await parseInput(import.meta.dir + "/" + filename);
  const sorted = hands.toSorted(sortHands);

  return sorted.reduce((acc, hand, i) => {
    return acc + (i + 1) * hand.bid;
  }, 0);
}

export async function parseInput(filename: string): Promise<Hand[]> {
  const lines = await fileToStringArray(filename);

  return lines.map((line) => {
    const [raw, bid] = line.split(" ");

    const map = new Map<string, number>();
    for (const card of raw.split("")) {
      map.set(card, (map.get(card) || 0) + 1);
    }

    return {
      raw,
      map,
      type: getHandType(map),
      bid: Number(bid),
    };
  });
}

function sortHands(a: Hand, b: Hand): number {
  if (handValues[a.type] === handValues[b.type]) {
    // Start by comparing the first card in each hand. If these cards are different, the hand with the stronger first card is
    // considered stronger. If the first card in each hand have the same label, however, then move on to considering the second
    // card in each hand. If they differ, the hand with the higher second card wins; otherwise, continue with the third card in
    // each hand, then the fourth, then the fifth.
    for (let i = 0; i < 5; i++) {
      const aVal = cardValues[a.raw[i]];
      const bVal = cardValues[b.raw[i]];

      if (aVal !== bVal) {
        return aVal - bVal;
      }
    }
    invariant(false, "Hands are equal");
  }

  return handValues[a.type] - handValues[b.type];
}

const cardValues: { [card: string]: number } = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};

function getHandType(map: Map<string, number>): HandType {
  const mapValues = [...map.values()];

  if (map.size === 1) {
    return "fiveOfAKind";
  }

  if (map.size === 2) {
    if (mapValues.includes(4)) {
      return "fourOfAKind";
    }

    return "fullHouse";
  }

  if (map.size === 3) {
    if (mapValues.includes(3)) {
      return "threeOfAKind";
    }

    return "twoPair";
  }

  if (map.size === 4) {
    return "pair";
  }

  return "highCard";
}
