const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

let result = 0;
for (const line of input.split("\n")) {
  const [first, second] = line.split(",");

  const [firstMin, firstMax] = first.split("-");
  const [secondMin, secondMax] = second.split("-");

  if (
    (+firstMin >= +secondMin && +firstMin <= +secondMax) ||
    (+secondMin >= +firstMin && +secondMin <= +firstMax)
  ) {
    result++;
  }
}

console.log(result);
