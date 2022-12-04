const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

let result = 0;

for (const line of input.split("\n")) {
  const [begin1, end1, begin2, end2] = line
    .split(/,|-/)
    .map((x) => parseInt(x));
  if (
    (begin1 >= begin2 && begin1 <= end2) ||
    (begin2 >= begin1 && begin2 <= end1)
  ) {
    result++;
  }
}

console.log(result);
