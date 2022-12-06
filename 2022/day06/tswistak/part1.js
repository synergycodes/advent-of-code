const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const chars = input.split("");

for (let i = 3; i < chars.length; i++) {
  const count = new Set([chars[i - 3], chars[i - 2], chars[i - 1], chars[i]])
    .size;
  if (count === 4) {
    console.log(i + 1);
    break;
  }
}
