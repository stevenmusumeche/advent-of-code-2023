import { fileToGrid } from "../common";
import {
  toRichGrid,
  getPartNumberBoundaries,
  isBoundaryAdjacentToSymbol,
} from "./common";

export async function run(filename: string) {
  const grid = await fileToGrid(import.meta.dir + "/" + filename);
  const richGrid = toRichGrid(grid);

  const adjacentBoundaries = [];
  for (let r = 0; r < richGrid.length; r++) {
    for (let c = 0; c < richGrid[r].length; c++) {
      const boundaries = getPartNumberBoundaries(richGrid, {
        row: r,
        column: c,
      });
      if (boundaries) {
        if (isBoundaryAdjacentToSymbol(richGrid, boundaries)) {
          adjacentBoundaries.push(boundaries);
          // skip to the end of the boundary
          c = boundaries.end.column;
        }
      }
    }
  }

  // return the sum of all the part numbers
  return adjacentBoundaries.reduce(
    (sum, boundary) => sum + parseInt(boundary.value, 10),
    0,
  );
}
