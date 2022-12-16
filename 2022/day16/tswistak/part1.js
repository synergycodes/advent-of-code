const fs = require("fs");

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

// find max pressure we can get with distance 30
let maxPressure = Number.NEGATIVE_INFINITY;
const stack = [{ time: 30, pressure: 0, path: ["AA"] }];
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
    maxPressure = Math.max(maxPressure, pressure);
  }
}

console.log(maxPressure);
