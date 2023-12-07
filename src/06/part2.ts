import { fileContents, invariant } from "../common";
import { Race, getNumWinningOptions } from "./common";

export async function run(filename: string) {
  const race = await parseInput(import.meta.dir + "/" + filename);

  return getNumWinningOptions(race);
}

async function parseInput(fileName: string): Promise<Race> {
  const lines = (await fileContents(fileName))
    .split("\n")
    .map((line) => line.replaceAll(" ", ""));

  return {
    time: Number(lines[0].replace("Time:", "")),
    bestDistance: Number(lines[1].replace("Distance:", "")),
  };
}
