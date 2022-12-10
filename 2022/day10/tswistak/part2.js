const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

let counter = 0;
let x = 1;
const screen = Array.from({ length: 6 }, () =>
  Array.from({ length: 40 }, () => ".")
);

const draw = () => {
  const cnt = counter - 1;
  if (cnt % 40 >= x - 1 && cnt % 40 <= x + 1) {
    screen[Math.trunc(cnt / 40)][cnt % 40] = "#";
  }
};

for (const line of input.split("\n")) {
  const [instruction, arg] = line.split(" ");
  counter++;
  draw();
  if (instruction !== "noop") {
    counter++;
    draw();
    x += parseInt(arg);
  }
}

const result = screen.map((x) => x.join("")).join("\n");

console.log(result);
