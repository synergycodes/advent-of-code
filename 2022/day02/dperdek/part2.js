const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, { encoding: 'utf-8' });

const pointsMap = {
  A: 1, // rock
  B: 2, // paper
  C: 3, // scissors
  X: 0, // lose
  Y: 3, // draw
  Z: 6  // win
};

const actions = {
  A: {
    X: 'C',
    Y: 'A',
    Z: 'B'
  },
  B: {
    X: 'A',
    Y: 'B',
    Z: 'C'
  },
  C: {
    X: 'B',
    Y: 'C',
    Z: 'A'
  }
};

let result = 0;

for (const line of input.split("\n")) {
  const [opponent, todo] = line.split(" ");

  if (!opponent || !todo) {
    console.log(result);
    return;
  }

  result += pointsMap[actions[opponent][todo]] + pointsMap[todo];
}
