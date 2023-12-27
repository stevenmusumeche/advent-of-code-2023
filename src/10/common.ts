import { Coordinate, Grid, invariant } from "../common";

export type Pipe = "NS" | "EW" | "NE" | "NW" | "SE" | "SW" | "ground" | "start";

export type PipeKeys = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";

export const pipeMap: Record<PipeKeys, Pipe> = {
  "|": "NS",
  "-": "EW",
  L: "NE",
  J: "NW",
  "7": "SW",
  F: "SE",
  ".": "ground",
  S: "start",
};

export type Tile = {
  pipe: Pipe;
  coord: Coordinate;
};

export function findStart(grid: Grid<Tile>): Tile {
  const start = grid
    .flatMap((row) => row)
    .find((tile) => tile.pipe === "start");
  invariant(start, "no start found");
  return start;
}
