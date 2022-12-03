const fs = require("fs");
const _ = require("lodash");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const letterToPriority = (letter) => {
  const char = letter.charCodeAt(0);
  if (char >= "a".charCodeAt(0) && char <= "z".charCodeAt(0)) {
    return char - "a".charCodeAt(0) + 1;
  } else if (char >= "A".charCodeAt(0) && char <= "Z".charCodeAt(0)) {
    return char - "A".charCodeAt(0) + 27;
  } else {
    return 0;
  }
};

let result = 0;

for (const content of input.split("\n")) {
  const first = content.slice(0, content.length / 2).split("");
  const second = content.slice(content.length / 2).split("");
  const common = _.intersection(first, second);
  for (const item of common) {
    result += letterToPriority(item);
  }
}

console.log(result);
