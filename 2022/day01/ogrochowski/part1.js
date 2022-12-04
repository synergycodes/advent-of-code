const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

let max = 0;
let current = 0;

for (const line of input.split("\n")) {
  if (line.length > 0) {
    current += Number(line);
  } else {
    max = Math.max(max, current);
    current = 0;
  }
}

console.log(max);
