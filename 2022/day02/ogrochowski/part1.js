const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const pointsMap = {
    X: 1, // rock
    Y: 2, // paper
    Z: 3, // scissors
    WIN: 6,
    DRAW: 3
  };

  const win = {
    A: "Y", // rock < paper
    B: "Z", // paper < scissors
    C: "X", // scissors < rock
  };
  const draw = {
    A: "X", // rock
    B: "Y", // paper
    C: "Z", // scissors
  };

  let result = 0;

  for (const line of input.split("\n")) {
      const [opponnet, me] = line.split(" ");
      result += pointsMap[me];
      if(win[opponnet] === me){
          result += pointsMap.WIN;
      }else if(draw[opponnet] === me){
          result += pointsMap.DRAW
      }
  }

  console.log(result);