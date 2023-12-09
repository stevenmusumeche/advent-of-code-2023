import { parseInput, getNode, getInstruction, Node } from "./common";

export async function run(filename: string) {
  const map = await parseInput(import.meta.dir + "/" + filename);

  let curStep = 0;
  let cur = getNode(map, "AAA");

  while (true) {
    if (isEnd(cur)) {
      break;
    }

    const instruction = getInstruction(map, curStep);
    cur = getNode(map, instruction === "R" ? cur.right : cur.left);

    curStep++;
  }

  return curStep;
}

function isEnd(node: Node): boolean {
  return node.id === "ZZZ";
}
