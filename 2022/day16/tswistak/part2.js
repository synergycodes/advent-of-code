const fs = require("fs");
const _ = require("lodash");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

// parse input

const valves = new Map(); // key: string, value: number (rate)
const tunnels = new Map(); // key: string, value string[] (valves)
const interesting = new Set(); // key: string

for (const line of input.split("\n")) {
  const [_, valve, rate, neighbors] = line.match(
    /^Valve ([A-Z]{2}) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/
  );
  const rateNum = parseInt(rate);
  valves.set(valve, rateNum);
  tunnels.set(valve, neighbors.split(", "));
  if (rateNum > 0) {
    interesting.add(valve);
  }
}

// getting distances between all valves with floyd-warshall
const distanceMap = new Map(
  [...valves.keys()].map((k) => [
    k,
    new Map([...valves.keys()].map((i) => [i, Number.POSITIVE_INFINITY])),
  ])
); // key: string (from), value: Map (key: string (to), value: distance)
for (const [from, to] of tunnels) {
  for (const node of to) {
    distanceMap.get(from).set(node, 1);
  }
}
for (const v of valves.keys()) {
  distanceMap.get(v).set(v, 0);
}
for (const k of valves.keys()) {
  for (const i of valves.keys()) {
    for (const j of valves.keys()) {
      const currentDistance = distanceMap.get(i).get(j);
      const toK = distanceMap.get(i).get(k);
      const fromK = distanceMap.get(k).get(j);
      const newDistance = toK + fromK;
      if (currentDistance > newDistance) {
        distanceMap.get(i).set(j, newDistance);
      }
    }
  }
}

// find paths with pressure we can get with distance 26

const stack = [{ time: 26, pressure: 0, path: ["AA"] }];
const paths = [];
while (stack.length > 0) {
  const { time, pressure, path } = stack.pop();
  const last = path.at(-1);
  let anyAdded = false;
  for (const [key, distance] of distanceMap.get(last)) {
    if (path.includes(key) || distance > time - 2 || !interesting.has(key)) {
      continue;
    }
    const newTime = time - distance - 1;
    const newPressure = pressure + valves.get(key) * newTime;
    stack.push({
      time: newTime,
      pressure: newPressure,
      path: [...path, key],
    });
    anyAdded = true;
  }
  if (!anyAdded) {
    const pathSet = new Set(path);
    pathSet.delete("AA");
    paths.push({ path: pathSet, pressure });
  }
}

// find solution

const areSetsDifferent = (a, b) =>
  new Set([...a, ...b]).size === a.size + b.size;

const sorted = _.sortBy(paths, "pressure").reverse();

// sorted by pressure, so we can't get lower then what we'll find
let maxI = 1;
// find first occurrence
while (!areSetsDifferent(sorted[0].path, sorted[maxI].path)) {
  maxI++;
}

let result = sorted[0].pressure + sorted[maxI].pressure;
for (let i = 1; i <= maxI; i++) {
  for (let j = i + 1; j <= maxI + 1; j++) {
    const { path: path1, pressure: pressure1 } = sorted[i];
    const { path: path2, pressure: pressure2 } = sorted[j];
    if (areSetsDifferent(path1, path2)) {
      result = Math.max(result, pressure1 + pressure2);
    }
  }
}

console.log(result);
