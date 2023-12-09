import { fileToStringArray, invariant } from "../common";
import { DesertMap, Node, getInstruction, getNode, parseInput } from "./common";

export async function run(filename: string) {
  const map = await parseInput(import.meta.dir + "/" + filename);
  let curStep = 0;
  let curNodes = [...map.nodes.values()].filter((node) =>
    node.id.endsWith("A"),
  );
  const ghostSteps = [];

  while (curNodes.length > 0) {
    const instruction = getInstruction(map, curStep);
    const proposedNodes = curNodes
      .map((node) => toNextNode(map, node, instruction))
      .filter((node) => !node.id.endsWith("Z"));
    curStep++;

    // steps at 1 or more Z nodes found
    if (curNodes.length !== proposedNodes.length) {
      ghostSteps.push(curStep);
    }
    curNodes = proposedNodes;
  }

  return ghostSteps.reduce(lcm, 1);
}

function isEnd(nodes: Node[]): boolean {
  return nodes.every((node) => node.id.endsWith("Z"));
}

function toNextNode(map: DesertMap, node: Node, instruction: string): Node {
  const nextId = instruction === "R" ? node.right : node.left;
  return getNode(map, nextId);
}

const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
