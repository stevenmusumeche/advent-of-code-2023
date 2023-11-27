export async function fileContents(filePath: string): Promise<string> {
  const file = Bun.file(filePath);
  return await file.text();
}

export async function fileToStringArray(filePath: string): Promise<string[]> {
  return (await fileContents(filePath)).split("\n");
}
