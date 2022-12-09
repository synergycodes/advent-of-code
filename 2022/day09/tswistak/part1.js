const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

let tail = [0, 0];
let head = [0, 0];
const positions = new Set([JSON.stringify(tail)]);

for (const line of input.split("\n")) {
  const [direction, distStr] = line.split(" ");
  const distance = parseInt(distStr);
  let [hx, hy] = head;

  switch (direction) {
    case "U":
      head = [hx, hy + distance];
      break;
    case "D":
      head = [hx, hy - distance];
      break;
    case "L":
      head = [hx - distance, hy];
      break;
    case "R":
      head = [hx + distance, hy];
      break;
  }

  [hx, hy] = head;
  let [tx, ty] = tail;
  let dx = Math.abs(hx - tx);
  let dy = Math.abs(hy - ty);
  while (dx > 1 || dy > 1) {
    if (hx > tx) {
      tail = [tx + 1, ty];
    } else if (hx < tx) {
      tail = [tx - 1, ty];
    }
    tx = tail[0];
    if (hy > ty) {
      tail = [tx, ty + 1];
    } else if (hy < ty) {
      tail = [tx, ty - 1];
    }
    ty = tail[1];
    positions.add(JSON.stringify(tail));

    dx = Math.abs(hx - tx);
    dy = Math.abs(hy - ty);
  }
}

console.log(positions.size);
