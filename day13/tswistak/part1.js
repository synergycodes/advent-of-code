const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  let dots = [];
  const folds = [];

  lineReader.on("line", (line) => {
    if (line.trim() === "") {
      return;
    }
    if (line.startsWith("fold")) {
      const pos = line.replace("fold along ", "");
      const [xy, coord] = pos.split("=");
      folds.push([xy, parseInt(coord)]);
      return;
    }
    const coords = line.split(",").map((x) => parseInt(x));
    dots.push(coords);
  });

  await once(lineReader, "close");

  const [foldBy, foldAt] = folds[0];

  const toLeave = dots.filter(
    ([x, y]) => (foldBy === "x" && x < foldAt) || (foldBy === "y" && y < foldAt)
  );
  const toFold = dots.filter(
    ([x, y]) => (foldBy === "x" && x > foldAt) || (foldBy === "y" && y > foldAt)
  );

  dots = [
    ...new Set([
      ...toLeave.map((x) => JSON.stringify(x)),
      ...toFold.map(([x, y]) => {
        if (foldBy === "y") {
          return JSON.stringify([x, y + 2 * (foldAt - y)]);
        } else {
          return JSON.stringify([x + 2 * (foldAt - x), y]);
        }
      }),
    ]),
  ].map((x) => JSON.parse(x));

  console.log("dots", dots.length);
})();
