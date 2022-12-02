const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, { encoding: 'utf-8' });

const pointsMap = {
  X: 1, // rock
  Y: 2, // paper
  Z: 3, // scissors
  WIN: 6,
  DRAW: 3
};

const results = {
  A: {
    X: 0,
    Y: 1,
    Z: -1
  },
  B: {
    X: -1,
    Y: 0,
    Z: 1
  },
  C: {
    X: 1,
    Y: -1,
    Z: 0
  }
};

let result = 0;

for (const line of input.split("\n")) {
  const [opponent, me] = line.split(" ");

  if (!opponent || !me) {
    console.log(result);
    return;
  }

  result += pointsMap[me];
  if (results[opponent][me] === 1) {
    result += pointsMap.WIN;
  } else if (results[opponent][me] === 0) {
    result += pointsMap.DRAW;
  }
}
