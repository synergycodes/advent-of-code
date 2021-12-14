const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  let axiom = "";
  const rules = new Map();

  let i = 0;
  lineReader.on("line", (line) => {
    i++;
    if (i === 1) {
      axiom = line;
    } else if (i > 2) {
      const [toReplace, symbol] = line.split(" -> ");
      rules.set(toReplace, symbol);
    }
  });

  await once(lineReader, "close");

  let finalString = axiom;
  for (let i = 0; i < 10; i++) {
    let newString = "";
    let previous = null;
    for (const letter of [...finalString]) {
      if (previous !== null) {
        const key = `${previous}${letter}`;
        if (rules.has(key)) {
          newString += rules.get(key);
        }
      }
      newString += letter;
      previous = letter;
    }
    finalString = newString;
  }

  const counts = new Map();
  for (const letter of [...finalString]) {
    if (counts.has(letter)) {
      counts.set(letter, counts.get(letter) + 1);
    } else {
      counts.set(letter, 1);
    }
  }

  const values = [...counts.values()];
  const min = Math.min(...values);
  const max = Math.max(...values);

  console.log("result", max - min);
})();
