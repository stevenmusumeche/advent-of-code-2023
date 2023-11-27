import { Command, Option } from "commander";
import { existsSync } from "fs";


const program = new Command();
const days = Array.from({ length: 25 }, (_, i) => String(i + 1));

program
  .addOption(
    new Option("-d, --day <day>", "What day?")
      .choices(days)
      .makeOptionMandatory()
  )
  .addOption(
    new Option("-p, --problem <problem>", "Which problem?")
      .choices(["a", "b"])
      .makeOptionMandatory()
  );

  program.parse(process.argv);

  const options = program.opts<{ day: string; problem: "a" | "b" }>();
  const path = `${import.meta.dir}/${options.day.padStart(2, "0")}/`;
  const programPath = `${path}index.ts`;
  const inputPath = `${path}input.txt`;

  if (!existsSync(programPath)) {
    console.error(`Program file is missing - ${programPath}`);
    process.exit(1);
  }
  if (!existsSync(inputPath)) {
    console.error(`Input file is missing - ${inputPath}`);
    process.exit(1);
  }

  const selectedProgram = require(programPath);

  if (typeof selectedProgram.runA !== "function") {
    console.error(`Program is missing runA function`);
    process.exit(1);
  }

  if (typeof selectedProgram.runB !== "function") {
    console.error(`Program is missing runB function`);
    process.exit(1);
  }

  const answer =
    options.problem === "a"
      ? await selectedProgram.runA(inputPath)
      : await selectedProgram.runB(inputPath);

  console.log("\n================== ANSWER ==================\n");
  console.log(answer);
  console.log("\n============================================\n");