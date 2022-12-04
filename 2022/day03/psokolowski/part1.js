const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const getPriority = (char) => {
  const code = char.codePointAt(0);
  return code >= 97 && code <= 122 ? code - 96 : code - 38;
};

let result = 0;

for (const line of input.split("\n")) {
  const length = line.length;
  const first = line.slice(0, length / 2);
  const second = line.slice(length / 2);
  console.log(first, second);

  for (let i = 0; i < length / 2; i++) {
    const char = first[i];
    if (second.includes(char)) {
      result += getPriority(char);
      break;
    }
  }
}

console.log(result);
