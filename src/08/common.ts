import { fileContents, invariant } from "../common";

export function getInstruction(map: DesertMap, curStep: number): Instruction {
  return map.instructions[curStep % map.instructions.length];
}

const regex =
  /^(?<nodeId>[A-Z\d]{3}) = \((?<left>[A-Z\d]{3}), (?<right>[A-Z\d]{3})\)$/ims;
export async function parseInput(filename: string): Promise<DesertMap> {
  const sections = (await fileContents(filename)).split("\n\n");

  const instructions = sections[0].split("").filter(Boolean) as Instruction[];
  const nodes = sections[1].split("\n").map((line) => {
    const match = regex.exec(line);
    invariant(match?.groups?.nodeId, `Invalid node line ${line}`);
    invariant(match?.groups?.left, `Invalid node line ${line}`);
    invariant(match?.groups?.right, `Invalid node line ${line}`);

    return {
      id: match.groups.nodeId,
      left: match.groups.left,
      right: match.groups.right,
    };
  });

  return {
    instructions,
    nodes: new Map(nodes.map((node) => [node.id, node])),
  };
}

export type DesertMap = {
  instructions: Instruction[];
  nodes: Map<string, Node>;
};
export type Instruction = "R" | "L";

export type Node = {
  id: string;
  left: string;
  right: string;
};

export function getNode(map: DesertMap, id: string): Node {
  const node = map.nodes.get(id);
  invariant(node, `No node with id ${id}`);
  return node;
}
