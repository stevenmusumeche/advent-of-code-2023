import { fileToStringArray } from "../common";
import { invariant } from "../common/utils";

export async function run(filename: string) {
  const contents = await fileToStringArray(import.meta.dir + "/" + filename);

  const lineResults = contents.map((line) => {
    // find first digit
    let firstDigit;
    for (let i = 0; i < line.length; i++) {
      const entry = line[i];
      if (/^[\d]$/.test(entry)) {
        firstDigit = entry;
        break;
      }
    }
    invariant(!!firstDigit, "First digit not found");

    // find last digit
    let lastDigit;
    for (let i = line.length - 1; i >= 0; i--) {
      const entry = line[i];
      if (/^[\d]$/.test(entry)) {
        lastDigit = entry;
        break;
      }
    }
    invariant(!!lastDigit, "Last digit not found " + line);

    return parseInt(firstDigit + lastDigit);
  });

  return lineResults.reduce((acc, cur) => {
    return (acc += cur);
  }, 0);
}
