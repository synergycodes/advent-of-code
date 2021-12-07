const fs = require("fs");

const file = fs.readFileSync(__dirname + "/data.txt", "utf8");
const input = file.split(",").map((x) => parseInt(x));

const sumNextInts = (n) => (n * (n + 1)) / 2;

const maxLen = Math.max(...input);
let min = Number.POSITIVE_INFINITY;

for (let i = 0; i < maxLen; i++) {
  const current = input
    .map((x) => sumNextInts(Math.abs(x - i)))
    .reduce((prev, curr) => prev + curr);
  console.log(i, current);
  min = Math.min(min, current);
}

console.log("result", min);
