const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

let currentMax = 0;
let current = 0;

for (const line of input.split("\n")) {
  if (line.length > 0) {
    current += parseInt(line);
  } else {
    currentMax = Math.max(currentMax, current);
    current = 0;
  }
}

console.log(currentMax);
