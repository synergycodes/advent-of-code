const fs = require("fs");

const calories = fs
  .readFileSync(__dirname + "/data.txt", { encoding: "utf-8" })
  .split("\n");

let elves = [];

calories.reduce((prev, next) => {
  if (+next > 0) {
    return +prev + +next;
  } else {
    elves.push(prev);
    return 0;
  }
});

const result = elves
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((prev, curr) => prev + curr);

console.log(result);
