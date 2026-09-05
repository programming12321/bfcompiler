# bfcompiler

Welcome to **BF Compiler**, a Brainfuck compiler written in JavaScript.

BF Compiler allows you to compile and work with **Brainfuck (`.bf`) programs** directly from the command line.

## Features

* Brainfuck compiler written in JavaScript
* `.bf` file support
* Configurable memory size
* Maximum execution step limit
* Brainfuck error detection
* Command-line interface

## Usage

```bash
node brainfuck.js program.bf
```

### Memory size

```bash
node brainfuck.js program.bf --memory 50000
```

### Maximum steps

```bash
node brainfuck.js program.bf --maxsteps 100000
```

## Brainfuck

BF Compiler supports the standard Brainfuck instructions:

```text
>  Move pointer right
<  Move pointer left
+  Increment cell
-  Decrement cell
.  Output character
,  Input character
[  Start loop
]  End loop
```

## Example

Create a file called `hello.bf`:

```brainfuck
++++++++++[>+++++++>++++++++++>+++>+<<<<-]
>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.
```

Then run:

```bash
node brainfuck.js hello.bf
```

## Error detection

BF Compiler detects invalid Brainfuck loops, such as unmatched brackets:

```brainfuck
++[>+++
```

or:

```brainfuck
+++]
```

## License

MIT License

---

**BF Compiler** — Brainfuck compilation in JavaScript.
