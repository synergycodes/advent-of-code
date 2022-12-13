const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const pairs = [];
let currentPair = [];
for (const line of input.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed) {
    pairs.push(currentPair);
    currentPair = [];
  } else {
    currentPair.push(JSON.parse(line));
  }
}

const isCorrect = (first, second) => {
  // first case, both are numbers
  if (typeof first === "number" && typeof second === "number") {
    if (first > second) {
      return false;
    } else if (first === second) {
      return "eq";
    } else {
      return true;
    }
  } else {
    // second case, mixed types
    if (typeof first === "number") {
      return isCorrect([first], second);
    } else if (typeof second === "number") {
      return isCorrect(first, [second]);
    } else {
      // third case, both are arrays
      const length = Math.min(first.length, second.length);
      for (let i = 0; i < length; i++) {
        const result = isCorrect(first[i], second[i]);
        if (result !== "eq") {
          return result;
        }
      }
      return first.length < second.length
        ? true
        : first.length > second.length
        ? false
        : "eq";
    }
  }
};

const result = pairs
  .map(([first, second], i) => (!!isCorrect(first, second) ? i + 1 : 0))
  .reduce((a, b) => a + b);

console.log(result);
