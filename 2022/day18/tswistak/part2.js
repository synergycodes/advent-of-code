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

// return neighboring areas
const getNeighbors = (cube) => {
  const [x, y, z] = cube;
  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ];
};

// find min and max coords
const minX = Math.min(...Object.keys(grid));
const maxX = Math.max(...Object.keys(grid));
const minY = Math.min(...Object.values(grid).flatMap((x) => Object.keys(x)));
const maxY = Math.max(...Object.values(grid).flatMap((x) => Object.keys(x)));
const minZ = Math.min(
  ...Object.values(grid).flatMap((x) =>
    Object.values(x).flatMap((y) => Object.keys(y))
  )
);
const maxZ = Math.max(
  ...Object.values(grid).flatMap((x) =>
    Object.values(x).flatMap((y) => Object.keys(y))
  )
);

// bfs for finding water
const water = new Set();
const toVisit = [[maxX, maxY, maxZ]];
while (toVisit.length > 0) {
  const current = toVisit.pop();
  water.add(JSON.stringify(current));
  for (const neighbor of getNeighbors(current)) {
    if (water.has(JSON.stringify(neighbor))) {
      continue;
    }
    const [x, y, z] = neighbor;
    if (grid[x] && grid[x][y] && grid[x][y][z]) {
      continue;
    }
    if (
      x >= minX - 1 &&
      x <= maxX + 1 &&
      y >= minY - 1 &&
      y <= maxY + 1 &&
      z >= minZ - 1 &&
      z <= maxZ + 1
    ) {
      toVisit.push(neighbor);
    }
  }
}

let result = 0;
for (const cube of cubes) {
  const waterAround = getNeighbors(cube).filter((x) =>
    water.has(JSON.stringify(x))
  );
  result += waterAround.length;
}

console.log(result);
