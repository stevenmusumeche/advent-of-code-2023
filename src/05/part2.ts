import { fileContents } from "../common";
import { toLocationNumber, parseMaps } from "./common";

export async function run(filename: string) {
  const { seeds, maps } = await parseInput(filename);
  const locations = seeds.map((seed) => toLocationNumber(seed, maps));

  return Math.min(...locations);
}

async function parseInput(filename: string) {
  const raw = await fileContents(import.meta.dir + "/" + filename);
  const sections = raw.split("\n\n");
  const seeds = parseSeeds(sections);
  const maps = parseMaps(sections);
  return { seeds, maps };
}

function parseSeeds(sections: string[]) {
  const numbers = sections[0].replace("seeds: ", "").split(" ").map(Number);
  const seeds = [];
  for (let i = 0; i < numbers.length; i += 2) {
    for (let j = 0; j < numbers[i + 1]; j++) {
      seeds.push(numbers[i] + j);
    }
  }

  return seeds;
}
