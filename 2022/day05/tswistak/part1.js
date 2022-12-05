const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const stacks = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
};

let isInStacks = true;
for (const line of input.split("\n")) {
  if (isInStacks) {
    if (line.trim().startsWith("1")) {
      isInStacks = false;
      continue;
    }
    for (let i = 0; i < 9; i++) {
      // (0,0), (1,4), (2,8) etc => 4*i
      const letter = line[4 * i + 1];
      if (letter.trim().length > 0) {
        stacks[i + 1].push(letter);
      }
    }
  } else if (line.startsWith("move")) {
    const [_, howMany, from, to] = line.match(/move (\d+) from (\d) to (\d)/);
    for (let i = 0; i < howMany; i++) {
      stacks[to].unshift(stacks[from].shift());
    }
  }
}

const result = Object.values(stacks)
  .map((x) => x[0][0])
  .join("");

console.log(result);
