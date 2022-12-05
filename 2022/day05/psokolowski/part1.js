const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

let lines = input.split("\n");
const stacksRaw = lines.slice(0, 8);
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
stacksRaw.forEach((stack) => {
  [...stack].forEach((_, index) => {
    const sign = stack.slice(index, 3 + index).trim();
    if (sign.length === 3 && sign[1] !== " ") {
      if (index === 0) {
        stacks[index + 1].unshift(sign);
      } else {
        const col = Math.floor(index / 4);
        stacks[col + 1].unshift(sign);
      }
    }
  });
});
const moves = lines.slice(10);

moves.forEach((line) => {
  const movesArray = line
    .replace("move", "")
    .replace("from", "")
    .replace("to", "");
  const [move, from, to] = movesArray.trim().split("  ");
  const currentCrates = stacks[from].splice(-move, move);
  stacks[to].push(...currentCrates.reverse());
});

Object.keys(stacks).forEach((crates) => {
  const lastIndex = [stacks[crates].length - 1];
  console.log(stacks[crates][lastIndex]);
});
