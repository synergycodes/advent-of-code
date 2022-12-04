const fs = require("fs");

const input = fs.readFileSync(__dirname + '/input.txt', {encoding: "utf-8"});

const elves = [];

for( const line of input.split("\n")) {
    if(line.length > 0){
        const last = elves.length - 1
        const current = elves[last];
        elves[last] = current + Number(line);

    }else{
        elves.push(0)
    }
}

const result = elves
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((prev, curr) => prev + curr);

console.log(result);