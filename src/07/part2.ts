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
    const type = getHandType(map);
    const numWildcards = raw.split("").filter(isWildcard).length;
    let enhancedMap = new Map<string, number>();
    switch (type) {
      case "fiveOfAKind": {
        enhancedMap = map;
        break;
      }
      case "fourOfAKind": {
        // 2JJJJ
        if (numWildcards === 4) {
          enhancedMap = new Map<string, number>();
          let replacement = "";
          for (let i = 0; i < 5; i++) {
            const card = raw[i];
            if (!replacement && !isWildcard(card)) {
              replacement = raw[i];
            }
          }
          const enhancedRaw = raw.replaceAll("J", replacement);
          for (const card of enhancedRaw.split("")) {
            enhancedMap.set(card, (enhancedMap.get(card) || 0) + 1);
          }
        } else if (numWildcards === 1) {
          enhancedMap = new Map(
            [...map.entries()].map(([card, count]) => {
              if (count === 4) {
                return [card, 5];
              } else if (count === 1) {
                return [card, 0];
              }

              invariant(false, "Invalid fourOfAKind");
            }),
          );
        } else {
          enhancedMap = map;
        }
        break;
      }
      case "fullHouse": {
        // JJJAA
        if (numWildcards === 3) {
          enhancedMap = new Map<string, number>();
          let replacement = "";
          for (let i = 0; i < 5; i++) {
            const card = raw[i];
            if (!replacement && !isWildcard(card)) {
              replacement = raw[i];
            }
          }
          const enhancedRaw = raw.replaceAll("J", replacement);
          for (const card of enhancedRaw.split("")) {
            enhancedMap.set(card, (enhancedMap.get(card) || 0) + 1);
          }
        } else if (numWildcards === 2) {
          enhancedMap = new Map(
            [...map.entries()].map(([card, count]) => {
              if (count === 3) {
                return [card, 5];
              } else if (count === 2) {
                return [card, 0];
              }

              invariant(false, "Invalid fullHouse");
            }),
          );
        } else {
          enhancedMap = map;
        }
        break;
      }
      case "threeOfAKind": {
        // JJJ34
        if (numWildcards === 3) {
          enhancedMap = new Map<string, number>();
          let replacement = "";
          for (let i = 0; i < 5; i++) {
            const card = raw[i];
            if (!replacement && !isWildcard(card)) {
              replacement = raw[i];
            }
          }
          const enhancedRaw = raw.replaceAll("J", replacement);
          for (const card of enhancedRaw.split("")) {
            enhancedMap.set(card, (enhancedMap.get(card) || 0) + 1);
          }
        } else if (numWildcards === 2) {
          invariant(false, "Invalid threeOfAKind" + raw);
        } else if (numWildcards === 1) {
          enhancedMap = new Map(
            [...map.entries()].map(([card, count]) => {
              if (count === 3) {
                return [card, 4];
              } else if (isWildcard(card)) {
                return [card, 0];
              }

              return [card, count];
            }),
          );
        } else {
          enhancedMap = map;
        }
        break;
      }
      case "twoPair": {
        // JJBB1
        if (numWildcards === 2) {
          enhancedMap = new Map(
            [...map.entries()].map(([card, count]) => {
              if (count === 2 && !isWildcard(card)) {
                return [card, 4];
              } else if (isWildcard(card)) {
                return [card, 0];
              }

              return [card, count];
            }),
          );
        } else if (numWildcards === 1) {
          let wildCardUsed = false;
          enhancedMap = new Map(
            [...map.entries()].map(([card, count]) => {
              if (count === 2 && !wildCardUsed) {
                wildCardUsed = true;
                return [card, 3];
              } else if (isWildcard(card)) {
                return [card, 0];
              }

              return [card, count];
            }),
          );
        } else {
          enhancedMap = map;
        }
        break;
      }
      case "pair": {
        // Q2KJJ
        if (numWildcards === 2) {
          enhancedMap = new Map<string, number>();
          let replacement = "";
          for (let i = 0; i < 5; i++) {
            const card = raw[i];
            if (!replacement && !isWildcard(card)) {
              replacement = raw[i];
            }
          }
          const enhancedRaw = raw.replaceAll("J", replacement);
          for (const card of enhancedRaw.split("")) {
            enhancedMap.set(card, (enhancedMap.get(card) || 0) + 1);
          }
        } else if (numWildcards === 1) {
          enhancedMap = new Map(
            [...map.entries()].map(([card, count]) => {
              if (count === 2) {
                return [card, 3];
              } else if (isWildcard(card)) {
                return [card, 0];
              }

              return [card, count];
            }),
          );
        } else {
          enhancedMap = map;
        }
        break;
      }
      case "highCard": {
        if (numWildcards === 1) {
          enhancedMap = new Map<string, number>();
          for (let i = 0; i < 5; i++) {
            const card = raw[i];
            if (isWildcard(card)) {
              let replacement;
              if (i === 4) {
                replacement = raw[i - 1];
              } else {
                replacement = raw[i + 1];
              }
              enhancedMap.set(
                replacement,
                (enhancedMap.get(replacement) || 0) + 1,
              );
            } else {
              enhancedMap.set(card, (enhancedMap.get(card) || 0) + 1);
            }
          }
        } else {
          enhancedMap = map;
        }
        break;
      }
    }

    // remove entries from enhancedMap that have a value of 0
    for (const [card, count] of enhancedMap.entries()) {
      if (count === 0) {
        enhancedMap.delete(card);
      }
    }

    return {
      raw,
      map: enhancedMap,
      type: getHandType(enhancedMap),
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
    invariant(false, "Hands are equal: " + a.raw + " and " + b.raw);
  }

  return handValues[a.type] - handValues[b.type];
}

const cardValues: { [card: string]: number } = {
  A: 14,
  K: 13,
  Q: 12,
  T: 11,
  9: 10,
  8: 9,
  7: 8,
  6: 7,
  5: 6,
  4: 5,
  3: 4,
  2: 3,
  J: 2,
};

function isWildcard(card: string): boolean {
  return card === "J";
}

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
