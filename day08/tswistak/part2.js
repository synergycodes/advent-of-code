const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  let sum = 0;

  lineReader.on("line", (line) => {
    const [input, output] = line.split(" | ").map((x) => x.split(" "));
    const numbers = [
      ...new Set([...input, ...output].map((x) => x.split("").sort().join(""))),
    ].map((x) => [...x]);
    const patterns = new Map();

    // 1, 4, 7 and 8 are uniques among their lengths
    patterns.set(
      1,
      numbers.find((x) => x.length === 2)
    );
    patterns.set(
      4,
      numbers.find((x) => x.length === 4)
    );
    patterns.set(
      7,
      numbers.find((x) => x.length === 3)
    );
    patterns.set(
      8,
      numbers.find((x) => x.length === 7)
    );

    const fives = new Set();
    const sixes = new Set();

    // 3 has the same letters as 7 + d, g (length 5)
    patterns.set(
      3,
      numbers.find((x, i) => {
        const found =
          x.length === 5 && patterns.get(7).every((y) => x.includes(y));
        if (found) fives.add(i);
        return found;
      })
    );

    // 9 has the same letters as 4 + a, g (length 6)
    patterns.set(
      9,
      numbers.find((x, i) => {
        const found =
          x.length === 6 && patterns.get(4).every((y) => x.includes(y));
        if (found) sixes.add(i);
        return found;
      })
    );

    // 5 has the same letters as 9 - c (length 5)
    patterns.set(
      5,
      numbers.find((x, i) => {
        const found =
          x.length === 5 &&
          x.every((y) => patterns.get(9).includes(y)) &&
          !fives.has(i);
        if (found) fives.add(i);
        return found;
      })
    );

    // 6 has the same letters as 5 + e (length 6)
    patterns.set(
      6,
      numbers.find((x, i) => {
        const found =
          x.length === 6 &&
          patterns.get(5).every((y) => x.includes(y)) &&
          !sixes.has(i);
        if (found) sixes.add(i);
        return found;
      })
    );

    // 2 is now the only one left with length 5
    patterns.set(
      2,
      numbers.find((x, i) => x.length === 5 && !fives.has(i))
    );

    // 0 is now the only one left with length 6
    patterns.set(
      0,
      numbers.find((x, i) => x.length === 6 && !sixes.has(i))
    );

    // reverse patterns map to get lookup for digits
    const solutions = new Map();
    for (const [number, pattern] of patterns) {
      solutions.set(pattern.join(""), number);
    }

    // compute result
    const normalizedOutput = output.map((x) => x.split("").sort().join(""));
    const result = parseInt(
      normalizedOutput.map((x) => solutions.get(x)).join("")
    );
    sum += result;
  });

  await once(lineReader, "close");

  console.log("sum", sum);
})();
