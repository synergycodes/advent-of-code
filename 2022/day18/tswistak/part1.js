const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

// parsing input
const cubes = [];
for (const line of input.split("\n")) {
  cubes.push(line.split(",").map((x) => parseInt(x)));
}

// creating grid
const grid = {};
for (const cube of cubes) {
  const [x, y, z] = cube;
  if (!grid[x]) {
    grid[x] = {};
  }
  if (!grid[x][y]) {
    grid[x][y] = {};
  }
  grid[x][y][z] = true;
}

// counting surface
let result = 0;
for (const cube of cubes) {
  const [x, y, z] = cube;
  if (!grid[x + 1] || !grid[x + 1][y] || !grid[x + 1][y][z]) {
    result++;
  }
  if (!grid[x - 1] || !grid[x - 1][y] || !grid[x - 1][y][z]) {
    result++;
  }
  if (!grid[x] || !grid[x][y + 1] || !grid[x][y + 1][z]) {
    result++;
  }
  if (!grid[x] || !grid[x][y - 1] || !grid[x][y - 1][z]) {
    result++;
  }
  if (!grid[x] || !grid[x][y] || !grid[x][y][z + 1]) {
    result++;
  }
  if (!grid[x] || !grid[x][y] || !grid[x][y][z - 1]) {
    result++;
  }
}

console.log(result);
