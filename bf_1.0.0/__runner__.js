"use strict";

class BrainfuckError extends Error {

    constructor(message, position = null) {

        super(
            position !== null
                ? `${message} at position ${position}`
                : message
        );

        this.name = "BrainfuckError";
        this.position = position;
    }
}


class BrainfuckRunner {

    constructor(options = {}) {

        this.memorySize =
            Number.isInteger(options.memorySize) &&
            options.memorySize > 0
                ? options.memorySize
                : 30000;

        this.maxSteps =
            Number.isInteger(options.maxSteps) &&
            options.maxSteps > 0
                ? options.maxSteps
                : 10000000;

        this.strictInput =
            options.strictInput === true;

        this.memory = new Uint8Array(
            this.memorySize
        );

        this.pointer = 0;
        this.codePointer = 0;

        this.input = "";
        this.inputPointer = 0;

        this.output = "";

        this.steps = 0;

        this.jumpForward = new Map();
        this.jumpBackward = new Map();
    }


    reset() {

        this.memory.fill(0);

        this.pointer = 0;
        this.codePointer = 0;

        this.input = "";
        this.inputPointer = 0;

        this.output = "";

        this.steps = 0;

        this.jumpForward.clear();
        this.jumpBackward.clear();
    }


    validate(code) {

        const stack = [];

        for (let i = 0; i < code.length; i++) {

            const instruction = code[i];

            if (instruction === "[") {

                stack.push(i);

            } else if (instruction === "]") {

                if (stack.length === 0) {

                    throw new BrainfuckError(
                        "']' without a matching '['",
                        i
                    );
                }

                const open = stack.pop();

                this.jumpForward.set(
                    open,
                    i
                );

                this.jumpBackward.set(
                    i,
                    open
                );
            }
        }

        if (stack.length > 0) {

            const position =
                stack[stack.length - 1];

            throw new BrainfuckError(
                "'[' without a matching ']'",
                position
            );
        }
    }


    execute(code, input = "") {

        this.reset();

        code = String(code);
        this.input = String(input);

        // Validate brackets before execution
        this.validate(code);

        while (
            this.codePointer < code.length
        ) {

            if (
                this.steps >= this.maxSteps
            ) {

                throw new BrainfuckError(
                    `Maximum execution steps exceeded (${this.maxSteps})`
                );
            }

            this.steps++;

            const instruction =
                code[this.codePointer];


            switch (instruction) {


                case ">":

                    this.pointer++;

                    if (
                        this.pointer >=
                        this.memorySize
                    ) {

                        throw new BrainfuckError(
                            `Memory pointer out of bounds (maximum: ${this.memorySize - 1})`,
                            this.codePointer
                        );
                    }

                    this.codePointer++;

                    break;


                case "<":

                    this.pointer--;

                    if (this.pointer < 0) {

                        throw new BrainfuckError(
                            "Memory pointer moved below zero",
                            this.codePointer
                        );
                    }

                    this.codePointer++;

                    break;


                case "+":

                    this.memory[this.pointer] =
                        (this.memory[this.pointer] + 1) & 255;

                    this.codePointer++;

                    break;


                case "-":

                    this.memory[this.pointer] =
                        (this.memory[this.pointer] - 1) & 255;

                    this.codePointer++;

                    break;


                case ".":

                    this.output +=
                        String.fromCharCode(
                            this.memory[this.pointer]
                        );

                    this.codePointer++;

                    break;


                case ",":

                    if (
                        this.inputPointer <
                        this.input.length
                    ) {

                        this.memory[this.pointer] =
                            this.input.charCodeAt(
                                this.inputPointer
                            ) & 255;

                        this.inputPointer++;

                    } else {

                        if (this.strictInput) {

                            throw new BrainfuckError(
                                "Insufficient input for ','",
                                this.codePointer
                            );
                        }

                        this.memory[this.pointer] = 0;
                    }

                    this.codePointer++;

                    break;


                case "[":

                    if (
                        this.memory[this.pointer] === 0
                    ) {

                        this.codePointer =
                            this.jumpForward.get(
                                this.codePointer
                            ) + 1;

                    } else {

                        this.codePointer++;
                    }

                    break;


                case "]":

                    if (
                        this.memory[this.pointer] !== 0
                    ) {

                        this.codePointer =
                            this.jumpBackward.get(
                                this.codePointer
                            );

                    } else {

                        this.codePointer++;
                    }

                    break;


                default:

                    // Ignore comments and
                    // non-Brainfuck characters
                    this.codePointer++;

                    break;
            }
        }

        return this.output;
    }
}


function runBrainfuck(
    code,
    input = "",
    options = {}
) {

    const runner =
        new BrainfuckRunner(options);

    return runner.execute(
        code,
        input
    );
}


module.exports = {

    BrainfuckRunner,
    BrainfuckError,
    runBrainfuck

};
