const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

// parsing input to number and set info about original index
const values = input
  .split("\n")
  .map((x, i) => ({ value: parseInt(x), originalIndex: i }));

// create new array
const move = (arr, from, to) => {
  if (from - to < 0) {
    for (let i = from; i < to; i++) {
      const tmp = arr[i + 1];
      arr[i + 1] = arr[i];
      arr[i] = tmp;
    }
  } else {
    for (let i = from; i > to; i--) {
      const tmp = arr[i - 1];
      arr[i - 1] = arr[i];
      arr[i] = tmp;
    }
  }
};

// helper for calculating real modulo
const mod = (a, b) => {
  let r = a % b;
  if (r < 0) {
    if (b > 0) {
      r = r + b;
    } else {
      r = r - b;
    }
  }
  return r;
};

// move numbers around
for (let i = 0; i < values.length; i++) {
  const toMove = values.findIndex((x) => x.originalIndex === i);
  let value = values[toMove].value;
  let newPosition = mod(toMove + value, values.length - 1);
  move(values, toMove, newPosition);
  console.log(i, values);
}

// find 0th element
const zeroIndex = values.findIndex((x) => x.originalIndex === 0);

// calculate result
const value1000 = values[(zeroIndex + 1000) % values.length].value;
const value2000 = values[(zeroIndex + 2000) % values.length].value;
const value3000 = values[(zeroIndex + 3000) % values.length].value;
const result = value1000 + value2000 + value3000;

// console.log(values);
console.log(value1000, value2000, value3000, result);
