const fs = require("fs");

const input = fs.readFileSync(__dirname + "/data.txt", { encoding: "utf-8" });

const pointsMap = {
  X: 1, // rock
  Y: 2, // paper
  Z: 3, // scissors
  WIN: 6,
  DRAW: 3,
};

const playAgainstRock = (shape) => {
  const map = new Map();
  map.set("X", pointsMap.X + pointsMap.DRAW);
  map.set("Y", pointsMap.Y + pointsMap.WIN);
  map.set("Z", pointsMap.Z);

  return map.get(shape);
};

const playAgainstPaper = (shape) => {
  const map = new Map();
  map.set("X", pointsMap.X);
  map.set("Y", pointsMap.Y + pointsMap.DRAW);
  map.set("Z", pointsMap.Z + pointsMap.WIN);

  return map.get(shape);
};

const playAgainstScissors = (shape) => {
  const map = new Map();
  map.set("X", pointsMap.X + pointsMap.WIN);
  map.set("Y", pointsMap.Y);
  map.set("Z", pointsMap.Z + pointsMap.DRAW);

  return map.get(shape);
};

const functionMap = {
  A: playAgainstRock,
  B: playAgainstPaper,
  C: playAgainstScissors,
};

let result = 0;

for (const line of input.split("\n")) {
  const [opponent, me] = line.trim().split(" ");
  if (!opponent || !me) {
    console.log(result);
    return;
  }
  result += functionMap[opponent](me);
}
