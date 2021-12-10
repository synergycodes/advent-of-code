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

  const errorValues = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };

  let sum = 0;

  lineReader.on("line", (line) => {
    const opened = [];
    for (const char of [...line]) {
      if (openings.has(char)) {
        opened.push(char);
      } else if (opened.length > 0) {
        if (opened[opened.length - 1] === endToOpenMap[char]) {
          opened.pop();
        } else {
          sum += errorValues[char];
          break;
        }
      }
    }
  });

  await once(lineReader, "close");

  console.log("sum", sum);
})();
