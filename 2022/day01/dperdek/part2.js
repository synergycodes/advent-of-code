const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, { encoding: "utf-8" });

const elves = [0];

for (const line of input.split('\n')) {
  if (line.length > 0) {
    const lastIndex = elves.length - 1;
    const current = elves[lastIndex];
    elves[lastIndex] = current + parseInt(line);
  } else {
    elves.push(0);
  }
}

const result = elves
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((prev, curr) => prev + curr);

console.log(result);
