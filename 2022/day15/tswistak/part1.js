const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

// parse
const sensorBeaconPairs = []; // { sensor: [x,y], beacon: [x,y], range: 0 }

for (const line of input.split("\n")) {
  const [_, sensorX, sensorY, beaconX, beaconY] = line.match(
    /^.* x=(-?\d+), y=(-?\d+): .* x=(-?\d+), y=(-?\d+)$/
  );
  sensorBeaconPairs.push({
    sensor: [parseInt(sensorX), parseInt(sensorY)],
    beacon: [parseInt(beaconX), parseInt(beaconY)],
    range: 0,
  });
}

// find x range
const getRange = (first, second) =>
  Math.abs(first[0] - second[0]) + Math.abs(first[1] - second[1]);

let minX = Number.POSITIVE_INFINITY;
let maxX = Number.NEGATIVE_INFINITY;

for (const pair of sensorBeaconPairs) {
  const { sensor, beacon } = pair;
  const range = getRange(sensor, beacon);
  minX = Math.min(minX, sensor[0] - range, beacon[0]);
  maxX = Math.max(maxX, sensor[0] + range, beacon[0]);
  pair.range = range;
}

// find impossible positions
let result = 0;
const y = 2000000;

for (let x = minX; x <= maxX; x++) {
  for (const { sensor, beacon, range } of sensorBeaconPairs) {
    if (x !== beacon[0] || y !== beacon[1]) {
      const testRange = getRange([x, y], sensor);
      if (testRange <= range) {
        // impossible position, can go to next sensor
        result++;
        break;
      }
    }
  }
}

console.log(result);
