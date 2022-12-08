const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const map = [];
for (const line of input.split("\n")) {
  map.push(line.split("").map((x) => parseInt(x)));
}

const getLeft = (i, j) => {
  if (j === 0) {
    return [];
  }
  return map[i].slice(0, j).reverse();
};
const getRight = (i, j) => {
  if (j === map[i].length - 1) {
    return [];
  }
  return map[i].slice(j + 1);
};
const getTop = (i, j) => {
  if (i === 0) {
    return [];
  }
  return map
    .slice(0, i)
    .map((x) => x[j])
    .reverse();
};
const getBottom = (i, j) => {
  if (i === map.length - 1) {
    return [];
  }
  return map.slice(i + 1).map((x) => x[j]);
};
const countVisible = (value, array) => {
  let result = 0;
  for (const current of array) {
    result++;
    if (current >= value) {
      break;
    }
  }
  return result;
};

let result = 0;
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    const current = map[i][j];
    const currentResult =
      countVisible(current, getLeft(i, j)) *
      countVisible(current, getRight(i, j)) *
      countVisible(current, getTop(i, j)) *
      countVisible(current, getBottom(i, j));
    result = Math.max(currentResult, result);
  }
}

console.log(result);
