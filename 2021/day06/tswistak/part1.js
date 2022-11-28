const fs = require("fs");

const file = fs.readFileSync(__dirname + "/data.txt", "utf8");
const input = file.split(",").map((x) => parseInt(x));

let previous = [...input];
let current = [...previous];
for (let i = 0; i < 80; i++) {
  for (let j = 0; j < previous.length; j++) {
    const val = previous[j];
    if (previous[j] !== 0) {
      current[j] = previous[j] - 1;
    } else {
      current[j] = 6;
      current.push(8);
    }
  }
  previous = current;
  current = [...previous];
}

console.log("result", current.length);
