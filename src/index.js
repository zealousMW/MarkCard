import { program } from "commander";
import { parseFileToJson } from "./parser.js";
import { renderFile } from "./renderer.js";
import { resolve } from "path";

program
  .name("markcard")
  .description("MarkCard CLI — parse Markdown into card JSON and render HTML");

program
  .command("parse <input>")
  .description("Parse a markdown file into cards JSON")
  .option("-o, --out <file>", "output JSON file", "output/cards.json")
  .action((input, opts) => {
    const inPath = resolve(process.cwd(), input);
    const outPath = resolve(process.cwd(), opts.out);
    console.log(`Parsing ${inPath} -> ${outPath}`);
    const json = parseFileToJson(inPath, outPath);
    console.log(`Wrote ${outPath} (${json.cards.length} cards)`);
  });

program
  .command("render <json>")
  .description("Render cards JSON to an HTML preview")
  .option("-o, --out <file>", "output HTML file", "output/sample.html")
  .action((jsonPath, opts) => {
    const inJson = resolve(process.cwd(), jsonPath);
    const outHtml = resolve(process.cwd(), opts.out);
    console.log(`Rendering ${inJson} -> ${outHtml}`);
    renderFile(inJson, outHtml);
    console.log(`Wrote HTML to ${outHtml}`);
  });

program
  .command("build <input>")
  .description("Parse a markdown file and render HTML (one-step)")
  .option("-j, --json <file>", "output JSON file", "output/cards.json")
  .option("-o, --out <file>", "output HTML file", "output/sample.html")
  .action((input, opts) => {
    const inPath = resolve(process.cwd(), input);
    const jsonPath = resolve(process.cwd(), opts.json);
    const outHtml = resolve(process.cwd(), opts.out);
    console.log(`Building: ${inPath} -> ${jsonPath} -> ${outHtml}`);
    parseFileToJson(inPath, jsonPath);
    renderFile(jsonPath, outHtml);
    console.log("Build complete.");
  });

program.parse(process.argv);
