const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const packets = [];
for (const line of input.split("\n")) {
  const trimmed = line.trim();
  if (trimmed) {
    packets.push(JSON.parse(trimmed));
  }
}
const firstControl = [[2]];
const secondControl = [[6]];
packets.push(firstControl, secondControl);

const compare = (first, second) => {
  // first case, both are numbers
  if (typeof first === "number" && typeof second === "number") {
    if (first > second) {
      return 1;
    } else if (first === second) {
      return 0;
    } else {
      return -1;
    }
  } else {
    // second case, mixed types
    if (typeof first === "number") {
      return compare([first], second);
    } else if (typeof second === "number") {
      return compare(first, [second]);
    } else {
      // third case, both are arrays
      const length = Math.min(first.length, second.length);
      for (let i = 0; i < length; i++) {
        const result = compare(first[i], second[i]);
        if (result !== 0) {
          return result;
        }
      }
      return first.length - second.length;
    }
  }
};

packets.sort(compare);

const result =
  (packets.indexOf(firstControl) + 1) * (packets.indexOf(secondControl) + 1);
console.log(result);
