import { fileContents, invariant } from "../common";
import { getNumWinningOptions, Race } from "./common";

export async function run(filename: string) {
  const races = await parseInput(import.meta.dir + "/" + filename);

  const numRaceWinningOptions = races.map(getNumWinningOptions);

  return numRaceWinningOptions.reduce((a, b) => a * b, 1);
}

async function parseInput(fileName: string): Promise<Race[]> {
  const lines = (await fileContents(fileName)).split("\n").map(parseLine);
  const numRaces = lines[0].length;

  let races = [];
  for (let r = 0; r < numRaces; r++) {
    const time = lines[0][r];
    const bestDistance = lines[1][r];
    invariant(time !== undefined, "time is undefined");
    invariant(bestDistance !== undefined, "bestDistance is undefined");
    let race: Race = {
      time,
      bestDistance,
    };
    races.push(race);
  }

  return races;
}

export function parseLine(line: string) {
  return line
    .split(" ")
    .map((x, i) => (i > 0 ? x.trim() : undefined))
    .filter(Boolean)
    .map(Number);
}
