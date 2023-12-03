import { Grid } from "./utils";

export async function fileContents(filePath: string): Promise<string> {
  const file = Bun.file(filePath);
  return await file.text();
}

export async function fileToStringArray(filePath: string): Promise<string[]> {
  return (await fileContents(filePath)).split("\n");
}

export async function fileToGrid(filePath: string): Promise<Grid<string>> {
  return (await fileToStringArray(filePath)).map((x) => x.split(""));
}
