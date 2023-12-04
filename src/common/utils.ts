const prefix: string = "Invariant failed";

export function invariant(
  condition: any,
  message?: string | (() => string),
): asserts condition {
  if (condition) {
    return;
  }

  const provided: string | undefined =
    typeof message === "function" ? message() : message;

  const value: string = provided ? `${prefix}: ${provided}` : prefix;
  throw new Error(value);
}

export function printGrid<T extends { toString: () => string } = string>(
  grid: Grid<T>,
): void {
  for (let r = 0; r < grid.length; r++) {
    console.log(grid[r].map((x) => x.toString()).join(" "));
  }
}

export function coordinateValue(grid: Grid<string>, coordinate: Coordinate) {
  return (
    grid[coordinate.row][coordinate.column] ??
    invariant("no value for coordinate " + coordinate)
  );
}

export type Coordinate = { row: number; column: number };
export type Grid<T> = T[][];

export function isDefined<T>(value: T | undefined | null): value is T {
  return typeof value !== "undefined" && value !== null;
}
