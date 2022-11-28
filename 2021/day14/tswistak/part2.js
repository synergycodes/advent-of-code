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

  const increment = (map, key, value = 1) => {
    if (map.has(key)) {
      map.set(key, map.get(key) + value);
    } else {
      map.set(key, value);
    }
  };

  const pairs = new Map();
  const counts = new Map();

  let previous = null;
  for (const letter of [...axiom]) {
    increment(counts, letter);
    if (previous !== null) {
      increment(pairs, `${previous}${letter}`);
    }
    previous = letter;
  }

  for (let i = 0; i < 40; i++) {
    const newPairs = new Map();
    for (const [toReplace, replaceWith] of rules) {
      if (!pairs.has(toReplace)) continue;

      const count = pairs.get(toReplace);
      if (count === 0) continue;

      pairs.set(toReplace, 0);
      increment(counts, replaceWith, count);
      increment(newPairs, `${toReplace[0]}${replaceWith}`, count);
      increment(newPairs, `${replaceWith}${toReplace[1]}`, count);
    }

    for (const [pair, count] of newPairs) {
      increment(pairs, pair, count);
    }
  }

  const values = [...counts.values()];
  const min = Math.min(...values);
  const max = Math.max(...values);

  console.log("result", max - min);
})();
