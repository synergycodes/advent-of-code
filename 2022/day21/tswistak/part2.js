const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const ROOT = "root";
const HUMAN = "humn";

// parsing input
const monkeyValue = new Map();

for (const line of input.split("\n")) {
  const [id, value] = line.split(": ");
  if (/\d+/.test(value)) {
    if (id !== HUMAN) {
      monkeyValue.set(id, parseInt(value));
    } else {
      // remove value for human
      monkeyValue.set(id, null);
    }
  } else {
    const splitted = value.split(" ");
    if (id === ROOT) {
      // change operator for root
      splitted[1] = "=";
    }
    monkeyValue.set(id, splitted);
  }
}

// find path recursively from root, what we need to calculate
const path = [];
const findPath = (root) => {
  const value = monkeyValue.get(root);
  if (typeof value === "number") {
    return value;
  }
  if (value === null) {
    // unknown value, add to path
    path.unshift(root);
    return null;
  }
  const [left, op, right] = value;
  const leftValue = findPath(left);
  const rightValue = findPath(right);

  if (op === "=") {
    // calculate final result
    // start from last known value
    let result = leftValue ?? rightValue;
    // our path is one long equation, we just need to solve it
    for (let i = 0; i < path.length - 1; i++) {
      const monkey = path[i];
      const [left, op, right] = monkeyValue.get(monkey);
      const knownValue = typeof left === "number" ? left : right;
      switch (op) {
        // every time do the reverse operation
        case "+":
          result -= knownValue;
          break;
        case "-":
          if (knownValue === left) {
            result = knownValue - result;
          } else {
            result += knownValue;
          }
          break;
        case "*":
          result /= knownValue;
          break;
        case "/":
          if (knownValue === left) {
            result = knownValue / result;
          } else {
            result *= knownValue;
          }
          break;
      }
    }
    return result;
  }
  if (leftValue !== null && rightValue !== null) {
    // normal case, just calculate
    switch (op) {
      case "+":
        return leftValue + rightValue;
      case "-":
        return leftValue - rightValue;
      case "*":
        return leftValue * rightValue;
      case "/":
        return leftValue / rightValue;
    }
  }
  // one side is unknown
  if (leftValue === null) {
    value[2] = rightValue;
  } else {
    value[0] = leftValue;
  }
  // add to path
  path.unshift(root);
  return null;
};

const result = findPath(ROOT);
console.log(result);
