const fs = require("fs");
const { FibonacciHeap } = require("@tyriar/fibonacci-heap");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

// data parsing
const map = [];
const startPositions = [];
for (const line of input.split("\n")) {
  map.push(line.split(""));
}

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    const current = map[i][j];
    if (current === "S") {
      map[i][j] = "a";
      startPositions.push([i, j]);
    } else if (current === "E") {
      endPos = [i, j];
    } else if (current === "a") {
      startPositions.push([i, j]);
    }
  }
}

// Dijkstra
const getMapCoord = (i) => {
  const length = map[0].length;
  return [Math.floor(i / length), i % length];
};

const getAlgoCoord = (i, j) => {
  const length = map[0].length;
  return i * length + j;
};

const getWeight = (u, v) => {
  let first = map[u[0]][u[1]];
  let second = map[v[0]][v[1]];
  if (second === "E") {
    second = String.fromCharCode("z".charCodeAt(0) + 1);
  }
  if (first === "S") {
    first = String.fromCharCode("a".charCodeAt(0) - 1);
  }
  return second.charCodeAt(0) - first.charCodeAt(0);
};

const getNeighbors = (node) => {
  const result = [];
  const [y, x] = getMapCoord(node);
  const current = map[y][x];
  if (current === "E") {
    return result;
  }
  if (y > 0 && map[y - 1][x] !== "S" && getWeight([y, x], [y - 1, x]) <= 1) {
    result.push([y - 1, x]);
  }
  if (
    y < map.length - 1 &&
    map[y + 1][x] !== "S" &&
    getWeight([y, x], [y + 1, x]) <= 1
  ) {
    result.push([y + 1, x]);
  }
  if (x > 0 && map[y][x - 1] !== "S" && getWeight([y, x], [y, x - 1]) <= 1) {
    result.push([y, x - 1]);
  }
  if (
    x < map[y].length - 1 &&
    map[y][x + 1] !== "S" &&
    getWeight([y, x], [y, x + 1]) <= 1
  ) {
    result.push([y, x + 1]);
  }
  return result.map((x) => getAlgoCoord(x[0], x[1]));
};

const hasFinished = (i) => {
  const [ii, ij] = getMapCoord(i);
  const [ei, ej] = endPos;

  return ii === ei && ij === ej;
};

const dijkstra = (start) => {
  const vertices = map.reduce((a, b) => a + b.length, 0);
  const previous = Array(vertices).fill(null);
  const distance = Array(vertices).fill(Number.POSITIVE_INFINITY);
  distance[start] = 0;
  const queue = new FibonacciHeap();
  const queueNodes = Array(vertices);
  for (let i = 0; i < vertices; i++) {
    queueNodes[i] = queue.insert(distance[i], i);
  }
  while (!queue.isEmpty()) {
    const u = queue.extractMinimum().value;
    if (hasFinished(u)) {
      break;
    }
    for (const v of getNeighbors(u)) {
      const newDistance = distance[u] + 1;
      if (distance[v] > newDistance) {
        distance[v] = newDistance;
        previous[v] = u;
        queue.decreaseKey(queueNodes[v], newDistance);
      }
    }
  }

  return {
    distance,
    previous,
  };
};

const constructShortestPath = (previous, startNode, endNode, result = []) => {
  if (startNode === endNode) {
    result.push(startNode);
  } else if (previous[endNode] === null) {
    throw Error("No path");
  } else {
    constructShortestPath(previous, startNode, previous[endNode], result);
    result.push(endNode);
    return result;
  }
};

// execution
let currentMin = Number.POSITIVE_INFINITY;
for (const startPos of startPositions) {
  const { previous } = dijkstra(getAlgoCoord(startPos[0], startPos[1]));
  try {
    const path = constructShortestPath(
      previous,
      getAlgoCoord(startPos[0], startPos[1]),
      getAlgoCoord(endPos[0], endPos[1])
    );
    currentMin = Math.min(currentMin, path.length - 1);
  } catch (e) {}
}

console.log(currentMin);
