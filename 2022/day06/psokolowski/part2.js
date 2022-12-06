const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });
const marker = [];
let markerIndex = 0;
[...input].every((char, index) => {
  const isIncluded = marker.includes(char);
  if (!isIncluded) {
    marker.push(char);
    markerIndex = index;
  } else {
    marker.length = 0;
    marker.push(char);
  }
  return marker.length < 13;
});

console.log(markerIndex);
