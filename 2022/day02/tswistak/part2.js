const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });
const pointsMap = {
  A: 1, // rock
  B: 2, // paper
  C: 3, // scissors
};
const resultPointMap = {
  X: 0, // lose
  Y: 3, // draw
  Z: 6, // win
};
const toWin = {
  A: "B", // rock < paper
  B: "C", // paper < scissors
  C: "A", // scissors < rock
};
const toDraw = {
  A: "A", // rock
  B: "B", // paper
  C: "C", // scissors
};
const toLose = {
  A: "C", // rock > scissors
  B: "A", // paper > rock
  C: "B", // scissors > paper
};
const whatChoose = {
  X: toLose,
  Y: toDraw,
  Z: toWin,
};

let result = 0;

for (const line of input.split("\n")) {
  const [opponent, whatDo] = line.split(" ");
  result += resultPointMap[whatDo] + pointsMap[whatChoose[whatDo][opponent]];
}

console.log(result);
