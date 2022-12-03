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
let groups = [[]];

for (const content of input.split("\n")) {
  let current = groups[0];
  if (current.length === 3) {
    current = [];
    groups.unshift(current);
  }
  current.push(content.split(""));
}

for (const group of groups) {
  const common = _.intersection(...group);
  result += letterToPriority(common[0]);
}

console.log(result);
