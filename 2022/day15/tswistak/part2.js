const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

// parse
const getRange = (first, second) =>
  Math.abs(first[0] - second[0]) + Math.abs(first[1] - second[1]);

const sensorBeaconPairs = []; // { sensor: [x,y], beacon: [x,y], range: 0 }

for (const line of input.split("\n")) {
  const [_, sensorX, sensorY, beaconX, beaconY] = line.match(
    /^.* x=(-?\d+), y=(-?\d+): .* x=(-?\d+), y=(-?\d+)$/
  );
  const sensor = [parseInt(sensorX), parseInt(sensorY)];
  const beacon = [parseInt(beaconX), parseInt(beaconY)];
  sensorBeaconPairs.push({
    sensor,
    beacon,
    range: getRange(sensor, beacon),
  });
}

// find distress signal tuning
const maxCoord = 4000000;
const multiplier = 4000000;
let x = 0;
let y = 0;
let result = null;

while ((x <= maxCoord || y <= maxCoord) && result === null) {
  const sensorInRange = sensorBeaconPairs.find(
    ({ sensor, range }) => range >= getRange([x, y], sensor)
  );

  if (sensorInRange) {
    // set new coords
    const { sensor, range } = sensorInRange;
    const distance = getRange([x, y], sensor);
    const newX = x + range - distance + 1;
    x = newX > maxCoord ? 0 : newX;
    y = newX > maxCoord ? y + 1 : y;
  } else {
    // found result
    result = x * multiplier + y;
  }
}

console.log(result);
