const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  let horizontal = 0;
  let depth = 0;

  lineReader.on("line", (line) => {
    const current = line.split(" ");
    const direction = current[0];
    const length = parseInt(current[1]);
    if (direction === "forward") {
      horizontal += parseInt(length);
    } else if (direction === "up") {
      depth -= length;
    } else if (direction === "down") {
      depth += length;
    }
  });

  await once(lineReader, "close");

  console.log("part 1", horizontal * depth);
})();
