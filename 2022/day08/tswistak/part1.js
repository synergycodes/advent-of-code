const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const map = [];
for (const line of input.split("\n")) {
  map.push(line.split("").map((x) => parseInt(x)));
}

const isVisibleFromLeft = (i, j) => {
  return map[i].slice(0, j).every((x) => x < map[i][j]);
};
const isVisibleFromRight = (i, j) => {
  return map[i].slice(j + 1).every((x) => x < map[i][j]);
};
const isVisibleFromTop = (i, j) => {
  return map.slice(0, i).every((x) => x[j] < map[i][j]);
};
const isVisibleFromBottom = (i, j) => {
  return map.slice(i + 1).every((x) => x[j] < map[i][j]);
};

let result = 0;
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (i === 0 || j === 0 || i === map.length - 1 || j === map[i].length - 1) {
      result++;
    } else {
      const isVisible =
        isVisibleFromLeft(i, j) ||
        isVisibleFromRight(i, j) ||
        isVisibleFromTop(i, j) ||
        isVisibleFromBottom(i, j);
      if (isVisible) {
        result++;
      }
    }
  }
}

console.log(result);
