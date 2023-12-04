import { Coordinate, fileToGrid, isDefined } from "../common";
import {
  Boundary,
  RichCoordinate,
  RichGrid,
  getBoundaryKey,
  getPartNumberBoundaries,
  toRichGrid,
} from "./common";

export async function run(filename: string) {
  const grid = await fileToGrid(import.meta.dir + "/" + filename);
  const richGrid = toRichGrid(grid);

  const potentialGears: RichCoordinate[] = findPotentialGears(richGrid);

  let sum = 0;
  potentialGears.forEach((potentialGear) => {
    // A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the
    // result of multiplying those two numbers together.
    const adjacentBoundaries = getAdjacentBoundaries(richGrid, potentialGear);
    if (adjacentBoundaries.length === 2) {
      sum +=
        parseInt(adjacentBoundaries[0].value, 10) *
        parseInt(adjacentBoundaries[1].value, 10);
    }
  });

  return sum;
}

function findPotentialGears(richGrid: RichGrid) {
  const potentialGears: RichCoordinate[] = [];
  for (let r = 0; r < richGrid.length; r++) {
    for (let c = 0; c < richGrid[r].length; c++) {
      const coordinate = richGrid[r][c];
      if (coordinate.type === "gear") {
        potentialGears.push(coordinate);
      }
    }
  }
  return potentialGears;
}

/**
 * Get the boundaries that are adjacent to the given gear coordinate.
 */
function getAdjacentBoundaries(
  grid: RichGrid,
  gearCoordinate: RichCoordinate,
): Boundary[] {
  const adjacentDigitCoordinates: RichCoordinate[] = getAdjacentCoordinates(
    grid,
    gearCoordinate,
  ).filter((c) => c.type === "digit");

  // limit those adjacent coordinates to 1 per boundary
  const boundaries: Record<string, Boundary> = {};
  adjacentDigitCoordinates.forEach((c) => {
    const boundryForCoordinate = getPartNumberBoundaries(grid, c.coordinate);
    if (boundryForCoordinate) {
      boundaries[getBoundaryKey(boundryForCoordinate)] = boundryForCoordinate;
    }
  });

  return Object.values(boundaries);
}

/**
 * Get the coordinates that are adjacent to the given coordinate.
 */
function getAdjacentCoordinates(
  grid: RichGrid,
  coordinate: RichCoordinate,
): RichCoordinate[] {
  const { row, column } = coordinate.coordinate;
  const adjacentCoordinates: Coordinate[] = [
    { row: row - 1, column: column - 1 },
    { row: row - 1, column },
    { row: row - 1, column: column + 1 },
    { row: row + 1, column: column - 1 },
    { row: row + 1, column },
    { row: row + 1, column: column + 1 },
    { row, column: column - 1 },
    { row, column: column + 1 },
  ];

  return adjacentCoordinates
    .map((c) => {
      if (c.row < 0 || c.column < 0) {
        return undefined;
      }

      if (c.row >= grid.length || c.column >= grid[c.row].length) {
        return undefined;
      }

      return grid[c.row][c.column];
    })
    .filter(isDefined);
}
