const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const EMPTY = 0;
const STONE = 1;
const SAND = 2;

// parse input
const stones = input
  .split("\n")
  .map((x) => x.split(" -> ").map((y) => y.split(",").map((z) => parseInt(z))));

// set stones
const START = [500, 0];
const coordsToKey = (c) => JSON.stringify(c);
const keyToCoords = (k) => JSON.parse(k);

const field = new Map([[coordsToKey(START), EMPTY]]);
for (const stone of stones) {
  // stone = [ [coord_x, coord_y], [coord_x, coord_y], ... ]
  for (let i = 1; i < stone.length; i++) {
    const [startX, startY] = stone[i - 1];
    const [endX, endY] = stone[i];
    const dx = Math.sign(endX - startX);
    const dy = Math.sign(endY - startY);
    let [x, y] = [startX, startY];
    while (x !== endX + dx || y !== endY + dy) {
      field.set(coordsToKey([x, y]), STONE);
      x += dx;
      y += dy;
    }
  }
}

// add sand
let keepGoing = true;
const maxY = Math.max(...[...field.keys()].map((x) => keyToCoords(x)[1])) + 1;
while (keepGoing) {
  let [x, y] = START;
  while (true) {
    if (y === maxY) {
      // let the bodies hit the floor
      field.set(coordsToKey([x, y]), SAND);
      break;
    } else if (!field.has(coordsToKey([x, y + 1]))) {
      // empty field x, y+1
      y++;
    } else if (!field.has(coordsToKey([x - 1, y + 1]))) {
      // empty field x-1, y+1
      y++;
      x--;
    } else if (!field.has(coordsToKey([x + 1, y + 1]))) {
      // empty field x+1, y+1
      y++;
      x++;
    } else if (x === START[0] && y === START[1]) {
      // can't move from the top
      keepGoing = false;
      field.set(coordsToKey([x, y]), SAND);
      break;
    } else {
      // no more moves
      field.set(coordsToKey([x, y]), SAND);
      break;
    }
  }
}

const result = [...field.values()].filter((x) => x === SAND).length;

console.log(result);
