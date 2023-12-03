import invariant from "../common/utils";

export type Color = "blue" | "red" | "green";
export type GameSet = Record<Color, number>;
export type Game = {
  id: number;
  sets: GameSet[];
};

export function toGame(line: string): Game {
  const regex = /^Game (?<gameId>[\d]+): (?<sets>.*?)$/ims;
  const parts = regex.exec(line);
  invariant(parts?.groups?.gameId);
  invariant(parts?.groups?.sets);
  const { gameId, sets: rawSets } = parts.groups;

  const sets: GameSet[] = rawSets.split("; ").map((rawSet) => {
    let gameSet: GameSet = { blue: 0, green: 0, red: 0 };
    for (const dieGroup of rawSet.split(", ")) {
      const [num, color] = dieGroup.split(" ");
      invariant(!!num);
      invariant(!!color);
      gameSet[color as Color] = parseInt(num, 10);
    }
    return gameSet;
  });

  return {
    id: Number(gameId),
    sets,
  };
}
