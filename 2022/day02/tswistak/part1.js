const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });
const pointsMap = {
  X: 1, // rock
  Y: 2, // paper
  Z: 3, // scissors
};
const toWin = {
  A: "Y", // rock < paper
  B: "Z", // paper < scissors
  C: "X", // scissors < rock
};
const toDraw = {
  A: "X", // rock
  B: "Y", // paper
  C: "Z", // scissors
};
const FOR_WIN = 6;
const FOR_DRAW = 3;

let result = 0;

for (const line of input.split("\n")) {
  const [opponent, me] = line.split(" ");
  result += pointsMap[me];
  if (toWin[opponent] === me) {
    result += FOR_WIN;
  } else if (toDraw[opponent] === me) {
    result += FOR_DRAW;
  }
}

console.log(result);
