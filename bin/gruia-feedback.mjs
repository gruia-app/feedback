#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { runCli } from "../dist/esm/cli.js";

process.exitCode = await runCli(process.argv.slice(2), {
  env: process.env,
  stdout: (line) => process.stdout.write(`${line}\n`),
  stderr: (line) => process.stderr.write(`${line}\n`),
  readFile: (path) => readFileSync(path, "utf8"),
});
