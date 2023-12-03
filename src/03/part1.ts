import {
  Coordinate,
  Grid,
  RichCoordinate,
  RichGrid,
  SymbolType,
  coordinateValue,
  fileToGrid,
  invariant,
} from "../common";

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

function toRichGrid(grid: Grid<string>): RichGrid {
  return grid.map((row, rowIndex) =>
    row.map((_, columnIndex) =>
      toRichCoordinate(grid, { row: rowIndex, column: columnIndex }),
    ),
  );
}

function isBoundaryAdjacentToSymbol(grid: RichGrid, boundary: Boundary) {
  const { start, end } = boundary;
  // check for any symbols adjacent to any of the boundary coordinates
  for (let r = start.row; r <= end.row; r++) {
    for (let c = start.column; c <= end.column; c++) {
      const coordinate = { row: r, column: c };
      if (isCoordinateAdjacentToSymbol(grid, coordinate)) {
        return true;
      }
    }
  }

  return false;
}

function isCoordinateAdjacentToSymbol(grid: RichGrid, coordinate: Coordinate) {
  const { row, column } = coordinate;
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

  return adjacentCoordinates.some((c) => {
    if (c.row < 0 || c.column < 0) {
      return false;
    }

    if (c.row >= grid.length || c.column >= grid[c.row].length) {
      return false;
    }

    return grid[c.row][c.column].type === "symbol";
  });
}

function toRichCoordinate(
  grid: Grid<string>,
  coordinate: Coordinate,
): RichCoordinate {
  const value = coordinateValue(grid, coordinate);
  return {
    coordinate,
    value,
    type: getSymbolType(coordinateValue(grid, coordinate)),
    toString: () => value,
  };
}

type Boundary = {
  start: Coordinate;
  end: Coordinate;
  value: string;
};

function getPartNumberBoundaries(
  grid: RichGrid,
  coordinate: Coordinate,
): Boundary | undefined {
  // return undefined if the starting coordinate is not a digit
  if (grid[coordinate.row][coordinate.column].type !== "digit") {
    return undefined;
  }

  let start = { ...coordinate };
  let end = { ...coordinate };
  // search right
  for (let c = coordinate.column; c < grid[coordinate.row].length; c++) {
    const type = grid[coordinate.row][c].type;
    if (type === "digit") {
      end.column = c;
    } else {
      break;
    }
  }

  // search left
  for (let c = coordinate.column; c >= 0; c--) {
    const type = grid[coordinate.row][c].type;
    if (type === "digit") {
      start.column = c;
    } else {
      break;
    }
  }

  // get value of all coordinates within the boundary
  const value = grid[coordinate.row]
    .slice(start.column, end.column + 1)
    .map((x) => x.value)
    .join("");

  return { start, end, value };
}

function getSymbolType(entry: string): SymbolType {
  if (isDigit(entry)) {
    return "digit";
  } else if (isSymbol(entry)) {
    return "symbol";
  } else if (entry === ".") {
    return "empty";
  }

  invariant(false, "Unknown symbol type");
}

function isDigit(entry: string) {
  return entry.match(/[0-9]/) !== null;
}

function isSymbol(entry: string) {
  return !isDigit(entry) && entry !== ".";
}
