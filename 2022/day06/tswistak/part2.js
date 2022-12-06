const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const chars = input.split("");

for (let i = 13; i < chars.length; i++) {
  const count = new Set(chars.slice(i - 13, i + 1)).size;
  if (count === 14) {
    console.log(i + 1);
    break;
  }
}
