const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

// parsing input
const monkeyValue = new Map();

for (const line of input.split("\n")) {
  const [id, value] = line.split(": ");
  if (/\d+/.test(value)) {
    monkeyValue.set(id, parseInt(value));
  } else {
    monkeyValue.set(id, value.split(" "));
  }
}

// calculating values
let iterate = true;
while (iterate) {
  for (const [id, value] of monkeyValue) {
    if (typeof value === "number") {
      continue;
    }
    const [left, op, right] = value;
    const leftValue = monkeyValue.get(left);
    const rightValue = monkeyValue.get(right);
    if (typeof leftValue !== "number" || typeof rightValue !== "number") {
      continue;
    }
    switch (op) {
      case "+":
        monkeyValue.set(id, leftValue + rightValue);
        break;
      case "-":
        monkeyValue.set(id, leftValue - rightValue);
        break;
      case "*":
        monkeyValue.set(id, leftValue * rightValue);
        break;
      case "/":
        monkeyValue.set(id, leftValue / rightValue);
        break;
    }
    if (id === "root") {
      iterate = false;
      break;
    }
  }
}

console.log(monkeyValue.get("root"));
