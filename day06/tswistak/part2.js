const fs = require("fs");

const file = fs.readFileSync(__dirname + "/data.txt", "utf8");
const input = file.split(",").map((x) => parseInt(x));

const inputObj = {};
for (const number of input) {
  if (number in inputObj) {
    inputObj[number] = inputObj[number] + 1;
  } else {
    inputObj[number] = 1;
  }
}

let previous = {};
let current = { ...inputObj };

const addOrUpdate = (key, value) =>
  key in current
    ? (current[key] = current[key] + value)
    : (current[key] = value);

for (let i = 0; i < 256; i++) {
  console.log(i);
  previous = { ...current };
  current = {};
  for (const key in previous) {
    const value = previous[key];
    const intKey = parseInt(key);
    if (intKey === 0) {
      addOrUpdate("8", value);
      addOrUpdate("6", value);
    } else {
      addOrUpdate(`${intKey - 1}`, value);
    }
  }
}

let sum = 0n;
for (const key in current) {
  const value = current[key];
  sum = sum + BigInt(value);
}

console.log("result", sum);
