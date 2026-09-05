"use strict";

const fs = require("fs");
const path = require("path");

const { runBrainfuck } = require("./__runner__.js");
const { parseArguments } = require("./__keywords__.js");

function main() {

    try {

        const args = process.argv.slice(2);

        const options = parseArguments(args);

        if (!options.positional.length) {
            console.log(`
Brainfuck Runner

Uso:

  node bf_exe_ext\\\\bf.js archivo.bf
  node bf_exe_ext\\\\bf.js archivo.bf --memory 50000
  node bf_exe_ext\\\\bf.js archivo.bf --input "Hola"
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

        if (path.extname(filePath).toLowerCase() !== ".bf") {
            throw new Error(
                "File must have .bf extension."
            );
        }

        const code = fs.readFileSync(filePath, "utf8");

        const output = runBrainfuck(
            code,
            options.input,
            {
                memorySize: options.memory,
                maxSteps: options.maxsteps
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
