"use strict";

const fs = require("fs");
const path = require("path");

const { runBrainfuck } = require("./__runner__.js");
const { parseArguments } = require("./__keywords__.js");

function main() {

    try {

        const args = process.argv.slice(2);

        const options = parseArguments(process.argv.slice(2));

        if (!options.positional.length) {
            console.log(`
Brainfuck Runner

Usage:

  node bfcompiler\\\\bf.js archive.bf
  node bfcompiler\\\\bf.js archive.bf --memory 50000
  node bfcompiler\\\\bf.js archive.bf --input "Hello"
`);
            return;
        }

        const filename = options.positional[0];

        const filePath = path.resolve(filename);

        if (!fs.existsSync(filePath)) {
            throw new Error(
                `File not found: ${filename}`
            );
        }

        if (![".bf", ".b"].includes(path.extname(filePath).toLowerCase())) {
            throw new Error(
                "File must have .bf or .b extension."
            );
        }

        const code = fs.readFileSync(filePath, "utf8");

            
        const output = runBrainfuck(
            code,
            options.input,
            {
                memorySize: options.memory,
                maxSteps: options.maxsteps,
                debugOn: options.debug_on
            }
        );


        process.stdout.write(output);

    } catch (error) {

        console.error("");
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

main();
