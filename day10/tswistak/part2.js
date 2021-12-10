const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  const endToOpenMap = {
    ")": "(",
    "]": "[",
    "}": "{",
    ">": "<",
  };

  const openings = new Set(["(", "[", "{", "<"]);

  const values = {
    "(": 1,
    "[": 2,
    "{": 3,
    "<": 4,
  };

  const sums = [];

  lineReader.on("line", (line) => {
    const opened = [];
    let invalid = false;
    for (const char of [...line]) {
      if (openings.has(char)) {
        opened.push(char);
      } else if (opened.length > 0) {
        if (opened[opened.length - 1] === endToOpenMap[char]) {
          opened.pop();
        } else {
          invalid = true;
          break;
        }
      }
    }

    if (!invalid && opened.length > 0) {
      sum = 0;
      for (let i = opened.length - 1; i >= 0; i--) {
        const open = opened[i];
        sum = sum * 5 + values[open];
      }
      sums.push(sum);
    }
  });

  await once(lineReader, "close");

  const middle = sums.sort((a, b) => a - b)[Math.floor(sums.length / 2)];

  console.log("middle", middle);
})();
