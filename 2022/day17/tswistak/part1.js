const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });
const wind = input.split("");
const rocks = [
  // -
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  // +
  [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
  ],
  // |
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  // #
  [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
];
const width = 7;
const tower = [];

// TODO
for (let i = 0; i < 2022; i++) {}
