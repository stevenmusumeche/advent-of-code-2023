import { fileContents, fileToStringArray, invariant } from "../common";

export async function run(filename: string) {
  const lines = (await fileToStringArray(import.meta.dir + "/" + filename)).map(
    (line) => line.split(" ").map(Number),
  );

  const predictedValues = lines.map(
    (line) => predictNextDelta(line) + line[line.length - 1],
  );

  return predictedValues.reduce((a, b) => a + b, 0);
}

function predictNextDelta(numbers: number[]): number {
  if (isAllZeros(numbers)) {
    return 0;
  }

  const differences = [];
  for (let i = 0; i < numbers.length - 1; i++) {
    const num = numbers[i];
    const nextNum = numbers[i + 1];
    differences.push(nextNum - num);
  }

  return differences[differences.length - 1] + predictNextDelta(differences);
}

function isAllZeros(arr: number[]) {
  return arr.every((x) => x === 0);
}
