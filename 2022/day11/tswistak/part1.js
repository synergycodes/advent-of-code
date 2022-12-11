const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

// { items, operation(old), test, ifTrue, ifFalse }
const monkeys = [];

const createOperation = (operation) => (old) => {
  return eval(operation);
};

let currentMonkey = {};
for (const line of input.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed) {
    monkeys.push(currentMonkey);
  } else if (trimmed.startsWith("Monkey")) {
    currentMonkey = {};
  } else if (trimmed.startsWith("Starting items:")) {
    currentMonkey.items = trimmed
      .replace("Starting items: ", "")
      .split(",")
      .map((x) => parseInt(x));
  } else if (trimmed.startsWith("Operation")) {
    currentMonkey.operation = createOperation(
      trimmed.replace("Operation: new = ", "")
    );
  } else if (trimmed.startsWith("Test")) {
    currentMonkey.test = parseInt(trimmed.replace("Test: divisible by ", ""));
  } else if (trimmed.startsWith("If true")) {
    currentMonkey.ifTrue = parseInt(
      trimmed.replace("If true: throw to monkey ", "")
    );
  } else if (trimmed.startsWith("If false")) {
    currentMonkey.ifFalse = parseInt(
      trimmed.replace("If false: throw to monkey ", "")
    );
  }
}

const inspections = Array.from({ length: monkeys.length }).fill(0);

for (let i = 0; i < 20; i++) {
  for (let j = 0; j < monkeys.length; j++) {
    for (let k = 0; k < monkeys[j].items.length; k++) {
      let newWorryLevel = Math.trunc(
        monkeys[j].operation(monkeys[j].items[k]) / 3
      );
      inspections[j] = inspections[j] + 1;
      if (newWorryLevel % monkeys[j].test === 0) {
        monkeys[monkeys[j].ifTrue].items.push(newWorryLevel);
      } else {
        monkeys[monkeys[j].ifFalse].items.push(newWorryLevel);
      }
    }
    monkeys[j].items = [];
  }
}

const result = inspections
  .sort((a, b) => b - a)
  .slice(0, 2)
  .reduce((a, b) => a * b, 1);
console.log(result);
