const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  let values = [];
  let increases = 0;

  lineReader.on("line", (line) => {
    const current = parseInt(line);
    if (values.length >= 3) {
      const previous = values.slice(-3);
      const previousSum = previous[0] + previous[1] + previous[2];
      const currentSum = previous[1] + previous[2] + current;
      if (currentSum > previousSum) {
        increases++;
      }
    }
    values.push(current);
  });

  await once(lineReader, "close");

  console.log("increases", increases);
})();
