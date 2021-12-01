const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  let previous;
  let increases = 0;

  lineReader.on("line", (line) => {
    const current = parseInt(line);
    if (typeof previous !== "undefined" && current > previous) {
      increases++;
    }
    previous = current;
  });

  await once(lineReader, "close");

  console.log("increases", increases);
})();
