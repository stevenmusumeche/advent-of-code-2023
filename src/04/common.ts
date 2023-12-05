import { intersection, invariant } from "../common";

export type Card = {
  number: number;
  winningNumbers: Set<number>;
  myNumbers: Set<number>;
};

type CardMap = Map<number, Card>;

export function parseInput(raw: string): CardMap {
  const cardMap = new Map<number, Card>();

  raw.split("\n").forEach((line) => {
    const regex =
      /Card (?<cardNumber>[\s\d]+): (?<winningNumbers>[\s\d]+?) \| (?<myNumbers>[\s\d]+)$/;
    const match = regex.exec(line);
    invariant(match?.groups, `Failed to parse line: ${line}`);
    const card = {
      number: parseInt(match.groups.cardNumber.trim(), 10),
      winningNumbers: new Set(
        match.groups.winningNumbers
          .trim()
          .split(" ")
          .filter(Boolean)
          .map(Number),
      ),
      myNumbers: new Set(
        match.groups.myNumbers.trim().split(" ").filter(Boolean).map(Number),
      ),
    };
    cardMap.set(card.number, card);
  });

  return cardMap;
}

export function getMatches(card: Card) {
  return intersection(card.winningNumbers, card.myNumbers);
}
