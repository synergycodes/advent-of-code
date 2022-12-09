const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const head = [...Array(10)].map((_) => [0, 0]);
const positions = new Set([JSON.stringify(head[0])]);

for (const line of input.split("\n")) {
  const [direction, distStr] = line.split(" ");
  const distance = parseInt(distStr);

  for (let i = 0; i < distance; i++) {
    const [hx, hy] = head[0];
    switch (direction) {
      case "U":
        head[0] = [hx, hy + 1];
        break;
      case "D":
        head[0] = [hx, hy - 1];
        break;
      case "L":
        head[0] = [hx - 1, hy];
        break;
      case "R":
        head[0] = [hx + 1, hy];
        break;
    }
    for (let i = 1; i < 10; i++) {
      const [ax, ay] = head[i - 1];
      let [bx, by] = head[i];
      const dx = Math.abs(ax - bx);
      const dy = Math.abs(ay - by);

      if (dx > 1 || dy > 1) {
        if (ax > bx) {
          head[i] = [bx + 1, by];
        } else if (ax < bx) {
          head[i] = [bx - 1, by];
        }
        bx = head[i][0];
        if (ay > by) {
          head[i] = [bx, by + 1];
        } else if (ay < by) {
          head[i] = [bx, by - 1];
        }
      }
      positions.add(JSON.stringify(head[9]));
    }
  }
}

console.log(positions.size);
