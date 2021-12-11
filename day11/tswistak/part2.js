const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  const lines = [];

  lineReader.on("line", (line) => {
    lines.push([...line].map((x) => parseInt(x)));
  });

  await once(lineReader, "close");

  let sum = 0;

  const checkFlashes = () => {
    let hasFlashed = false;
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] < 10) continue;
        lines[i][j] = 0;
        sum++;
        hasFlashed = true;
        if (i > 0 && j > 0 && lines[i - 1][j - 1] !== 0) lines[i - 1][j - 1]++;
        if (i > 0 && lines[i - 1][j] !== 0) lines[i - 1][j]++;
        if (i > 0 && j < lines[i].length - 1 && lines[i - 1][j + 1] !== 0)
          lines[i - 1][j + 1]++;
        if (j > 0 && lines[i][j - 1] !== 0) lines[i][j - 1]++;
        if (j < lines[i].length - 1 && lines[i][j + 1] !== 0) lines[i][j + 1]++;
        if (i < lines.length - 1 && j > 0 && lines[i + 1][j - 1] !== 0)
          lines[i + 1][j - 1]++;
        if (i < lines.length - 1 && lines[i + 1][j] !== 0) lines[i + 1][j]++;
        if (
          i < lines.length - 1 &&
          j < lines[i].length - 1 &&
          lines[i + 1][j + 1] !== 0
        )
          lines[i + 1][j + 1]++;
      }
    }

    if (hasFlashed) {
      checkFlashes();
    }
  };

  const checkAllZeros = () => {
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] !== 0) {
          return false;
        }
      }
    }
    return true;
  };

  let k = 0;
  for (k = 0; ; k++) {
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        lines[i][j]++;
      }
    }
    checkFlashes();

    if (checkAllZeros()) {
      break;
    }
  }

  console.log("k", k + 1);
})();
