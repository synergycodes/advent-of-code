const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

let counter = 1;
let x = 1;
const remembered = {};
const toRemember = [20, 60, 100, 140, 180, 220];

const checkCounter = () => {
  if (toRemember.includes(counter)) {
    remembered[counter] = x * counter;
  }
};

for (const line of input.split("\n")) {
  const [instruction, arg] = line.split(" ");
  if (instruction === "noop") {
    counter++;
    checkCounter();
  } else {
    counter++;
    checkCounter();
    counter++;
    x += parseInt(arg);
    checkCounter();
  }
}

const result = Object.values(remembered).reduce((a, b) => a + b);

console.log(remembered);
console.log(result);
