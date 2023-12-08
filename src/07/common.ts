import { fileToStringArray } from "../common";

export type Hand = {
  raw: string;
  map: Map<string, number>;
  type: HandType;
  bid: number;
};

export type HandType =
  | "highCard"
  | "pair"
  | "twoPair"
  | "threeOfAKind"
  | "fullHouse"
  | "fourOfAKind"
  | "fiveOfAKind";

export const handValues: Record<HandType, number> = {
  highCard: 0,
  pair: 1,
  twoPair: 2,
  threeOfAKind: 3,
  fullHouse: 4,
  fourOfAKind: 5,
  fiveOfAKind: 6,
};
