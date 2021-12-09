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

  const floodFill = (x, y) => {
    let size = 0;
    const fill = (i, j) => {
      if (
        i < 0 ||
        i >= map.length ||
        j < 0 ||
        j >= map[0].length ||
        map[i][j] === null ||
        map[i][j] === 9
      ) {
        return;
      }
      size++;
      map[i][j] = null;
      fill(i - 1, j);
      fill(i, j - 1);
      fill(i, j + 1);
      fill(i + 1, j);
    };
    fill(x, y);
    return size;
  };

  let topThree = [
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    for (let j = 0; j < row.length; j++) {
      const current = row[j];
      if (current === null) {
        continue;
      }
      const basinSize = floodFill(i, j);
      if (basinSize > topThree[0]) {
        topThree[0] = basinSize;
        topThree = topThree.sort((a, b) => a - b);
      }
    }
  }

  const result = topThree[0] * topThree[1] * topThree[2];

  console.log("topThree", topThree);
  console.log("result", result);
})();
