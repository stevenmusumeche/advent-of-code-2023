import { fileToStringArray } from "../common";
import invariant from "../common/utils";

const MAX_WORD_LENGTH = 5;

const numbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const firstWordRegexes = numbers.map((word) => new RegExp(`^${word}`));
const lastWordRegexes = numbers.map((word) => new RegExp(`${word}$`));

export async function run(filename: string) {
  const contents = await fileToStringArray(import.meta.dir + "/" + filename);

  const lineResults = contents.map((line) => {
    // find first digit
    let firstDigit;
    for (let i = 0; i < line.length; i++) {
      // try to match single digit
      const singleEntry = line[i];
      if (isSingleDigit(singleEntry)) {
        firstDigit = singleEntry;
      } else {
        // try to match number as word ("eight")
        const word = line.slice(i, i + MAX_WORD_LENGTH);
        const wordValue = getWordValue(word, firstWordRegexes);
        if (wordValue) {
          firstDigit = String(wordValue);
        }
      }

      if (firstDigit) break;
    }
    invariant(!!firstDigit, "First digit not found");

    // find last digit
    let lastDigit;
    for (let i = line.length - 1; i >= 0; i--) {
      const entry = line[i];
      if (isSingleDigit(entry)) {
        lastDigit = entry;
      } else {
        // try to match number as word ("eight")
        const firstIndex = Math.max(0, i - MAX_WORD_LENGTH + 1);
        const word = line.slice(firstIndex, i + 1);
        const wordValue = getWordValue(word, lastWordRegexes);
        if (wordValue) {
          lastDigit = String(wordValue);
        }
      }

      if (lastDigit) break;
    }
    invariant(!!lastDigit, "Last digit not found " + line);

    return parseInt(firstDigit + lastDigit);
  });

  return lineResults.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
}
function getWordValue(word: string, regexes: RegExp[]) {
  for (let j = 0; j < firstWordRegexes.length; j++) {
    if (regexes[j].test(word)) {
      return j + 1;
    }
  }
}

function isSingleDigit(singleEntry: string) {
  return /^[\d]$/.test(singleEntry);
}
