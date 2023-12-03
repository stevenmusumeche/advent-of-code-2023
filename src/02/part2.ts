import { fileToStringArray } from "../common";
import { toGame } from "./common";
import { Color, Game } from "./common";

export async function run(filename: string) {
  const contents = await fileToStringArray(import.meta.dir + "/" + filename);

  const games = contents.map(toGame);
  const minimums = games.map(getMinDie);
  const powers = minimums.map((x) => x.blue * x.green * x.red);

  return powers.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
}

function getMinDie(game: Game): Record<Color, number> {
  const maxes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  game.sets.forEach((set) => {
    if (set.blue > maxes.blue) {
      maxes.blue = set.blue;
    }
    if (set.green > maxes.green) {
      maxes.green = set.green;
    }
    if (set.red > maxes.red) {
      maxes.red = set.red;
    }
  });

  return maxes;
}
