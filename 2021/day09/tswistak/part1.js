const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  const map = [];

  lineReader.on("line", (line) => {
    map.push([...line].map((x) => parseInt(x)));
  });

  await once(lineReader, "close");

  let sum = 0;

  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    for (let j = 0; j < row.length; j++) {
      const current = row[j];
      const top = i > 0 ? map[i - 1][j] : Number.POSITIVE_INFINITY;
      const left = j > 0 ? row[j - 1] : Number.POSITIVE_INFINITY;
      const right = j < row.length - 1 ? row[j + 1] : Number.POSITIVE_INFINITY;
      const bottom =
        i < map.length - 1 ? map[i + 1][j] : Number.POSITIVE_INFINITY;

      if (
        current !== top &&
        current !== left &&
        current !== right &&
        current !== bottom &&
        Math.min(current, top, left, right, bottom) === current
      ) {
        sum += current + 1;
      }
    }
  }

  console.log("sum", sum);
})();
