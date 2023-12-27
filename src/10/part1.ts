import { Grid, fileContents, fileToGrid, invariant } from "../common";
import { findStart } from "./common";
import { Tile, pipeMap } from "./common";
import { cloneDeep } from "lodash-es";

export async function run(filename: string) {
  const grid = await parseInput(filename);

  const start = findStart(grid);
  const startMoves = getNextMovesForStart(grid, start);

  // console.log(
  //   "startMoves",
  //   startMoves.map((x) => x.coord),
  // );

  const result = startMoves.map((startMove) => {
    const result = getLengthOfLoop(grid, startMove, start);
    if (result) {
      return Math.ceil(result / 2);
    }
  });

  return result.filter((x) => x !== undefined)[0];
}

function getLengthOfLoop(
  grid: Grid<Tile>,
  tile: Tile,
  prevTile: Tile,
  len = 1,
): number | undefined {
  // console.log("-----\nworking on tile ", tile.coord.row, tile.coord.column);
  const next = getNextMove(grid, tile, prevTile);
  if (!next) {
    console.log("No next tile");
    return undefined;
  }
  if (next.pipe === "start") {
    // we made the loop
    return len;
  }
  return getLengthOfLoop(grid, next, tile, len + 1);
}

function getNextMove(
  grid: Grid<Tile>,
  current: Tile,
  prevTile: Tile,
): Tile | undefined {
  const {
    coord: { row, column },
    pipe,
  } = current;

  const moves: Tile[] = [];

  if (row > 0 && pipe.includes("N")) {
    moves.push(grid[row - 1][column]);
  }

  if (row < grid.length - 1 && pipe.includes("S")) {
    moves.push(grid[row + 1][column]);
  }

  if (column > 0 && pipe.includes("W")) {
    moves.push(grid[row][column - 1]);
  }

  if (column < grid[0].length - 1 && pipe.includes("E")) {
    moves.push(grid[row][column + 1]);
  }

  // remove tile if it is prevTile
  const validMoves = moves.filter(
    (t) =>
      (t.coord.column === prevTile.coord.column &&
        t.coord.row === prevTile.coord.row) === false,
  );

  invariant(validMoves.length <= 1, "validMoves too long");

  return validMoves[0];
}

function getNextMovesForStart(grid: Grid<Tile>, current: Tile): Tile[] {
  invariant(current.pipe === "start", "not a start tile");

  // check the adjacent tiles to see if they connect to this tile
  const {
    coord: { row, column },
    pipe,
  } = current;

  const moves: Tile[] = [];

  const tileAbove = grid[row - 1][column];
  if (row > 0 && tileAbove.pipe.includes("S")) {
    moves.push(tileAbove);
  }

  const tileBelow = grid[row + 1][column];
  if (row < grid.length - 1 && tileBelow.pipe.includes("N")) {
    moves.push(tileBelow);
  }

  const tileLeft = grid[row][column - 1];
  if (column > 0 && tileLeft.pipe.includes("E")) {
    moves.push(tileLeft);
  }

  const tileRight = grid[row][column + 1];
  if (column < grid[0].length - 1 && tileRight.pipe.includes("W")) {
    moves.push(tileRight);
  }

  return moves;
}

async function parseInput(filename: string): Promise<Grid<Tile>> {
  const raw = await fileToGrid(import.meta.dir + "/" + filename);

  return raw.map((line, r) =>
    line.map((entry, c) => ({
      coord: { row: r, column: c },
      pipe: pipeMap[entry as keyof typeof pipeMap],
    })),
  );
}
