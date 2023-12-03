import { fileToStringArray } from "../common";
import { Color, Game, toGame } from "./common";

const MAXES: Record<Color, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

export async function run(filename: string) {
  const contents = await fileToStringArray(import.meta.dir + "/" + filename);

  const games = contents.map(toGame);
  const possibleGames = games.filter(isGamePossible);

  return possibleGames.reduce((acc, cur) => {
    return acc + cur.id;
  }, 0);
}

function isGamePossible(game: Game): boolean {
  return game.sets.every((set) => {
    if (set.blue > MAXES.blue) return false;
    if (set.green > MAXES.green) return false;
    if (set.red > MAXES.red) return false;

    return true;
  });
}
