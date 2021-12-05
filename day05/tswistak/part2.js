const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  const lines = [];

  lineReader.on("line", (line) =>
    lines.push(
      line.split(" -> ").map((x) => x.split(",").map((y) => parseInt(y)))
    )
  );

  await once(lineReader, "close");

  const points = new Map();

  const addOrUpdatePoint = (x, y) => {
    const key = `${x},${y}`;
    if (points.has(key)) {
      points.set(key, points.get(key) + 1);
    } else {
      points.set(key, 1);
    }
  };

  const drawLine = ([[x0, y0], [x1, y1]]) => {
    let dx, dy, stepX, stepY;
    if (x0 < x1) {
      stepX = 1;
      dx = x1 - x0;
    } else {
      stepX = -1;
      dx = x0 - x1;
    }

    if (y0 < y1) {
      stepY = 1;
      dy = y1 - y0;
    } else {
      stepY = -1;
      dy = y0 - y1;
    }

    let x = x0;
    let y = y0;

    addOrUpdatePoint(x, y);

    if (dx > dy) {
      const incrE = dy * 2;
      const incrNE = (dy - dx) * 2;
      let d = dy * 2 - dx;
      while (x !== x1) {
        x += stepX;
        if (d <= 0) {
          d += incrE;
        } else {
          d += incrNE;
          y += stepY;
        }
        addOrUpdatePoint(x, y);
      }
    } else {
      const incrE = dx * 2;
      const incrNE = (dx - dy) * 2;
      let d = dx * 2 - dy;
      while (y !== y1) {
        y += stepY;
        if (d < 0) {
          d += incrE;
        } else {
          d += incrNE;
          x += stepX;
        }
        addOrUpdatePoint(x, y);
      }
    }
  };

  for (const line of lines) {
    drawLine(line);
  }

  const intersecting = [...points.values()].filter((x) => x > 1).length;

  console.log("intersecting", intersecting);
})();
