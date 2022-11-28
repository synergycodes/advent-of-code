const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  let sum = 0;

  const is478 = (encoded) => {
    const letters = new Set([...encoded]);
    return (
      letters.size === 2 || // 1
      letters.size === 4 || // 4
      letters.size === 3 || // 7
      letters.size === 7 // 8
    );
  };

  lineReader.on("line", (line) => {
    sum += line.split(" | ")[1].split(" ").filter(is478).length;
  });

  await once(lineReader, "close");

  console.log("sum", sum);
})();
