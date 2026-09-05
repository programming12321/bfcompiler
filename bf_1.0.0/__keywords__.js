"use strict";

function parseArguments(args) {

    const options = {
        input: "",
        memory: 30000,
        maxsteps: 10000000,
        positional: []
    };

    for (let i = 0; i < args.length; i++) {

        const arg = args[i];

        if (arg === "--input") {

            if (i + 1 >= args.length) {
                throw new Error("--input requires a value.");
            }

            options.input = args[++i];

        } else if (arg === "--memory") {

            if (i + 1 >= args.length) {
                throw new Error("--memory requires a value.");
            }

            const value = Number(args[++i]);

            if (!Number.isInteger(value) || value <= 0) {
                throw new Error(
                    "--memory must be a positive integer."
                );
            }

            options.memory = value;

        } else if (arg === "--maxsteps") {

            if (i + 1 >= args.length) {
                throw new Error("--maxsteps requires a value.");
            }

            const value = Number(args[++i]);

            if (!Number.isInteger(value) || value <= 0) {
                throw new Error(
                    "--maxsteps must be a positive integer."
                );
            }

            options.maxsteps = value;

        } else if (arg.startsWith("--")) {

            throw new Error(
                `Unknown option: ${arg}`
            );

        } else {

            options.positional.push(arg);
        }
    }

    return options;
}

module.exports = {
    parseArguments
};
