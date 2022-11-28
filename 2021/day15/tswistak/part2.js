const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  const map = [];

  lineReader.on("line", (line) => {
    map.push([...line].map((x) => parseInt(x)));
  });

  await once(lineReader, "close");

  const realEndI = map.length;
  const realEndJ = map[realEndI - 1].length;

  const accessMap = (i, j) => {
    const value = map[i % realEndI][j % realEndJ];
    const diffI = Math.floor(i / realEndI);
    const diffJ = Math.floor(j / realEndJ);
    return ((value + diffI + diffJ + 8) % 9) + 1;
  };

  const startI = 0;
  const startJ = 0;
  const endI = realEndI * 5 - 1;
  const endJ = realEndJ * 5 - 1;

  const getKey = (i, j) => `${i},${j}`;
  const getCoords = (key) => key.split(",").map((x) => parseInt(x));

  const queue = [];
  const distances = new Map();
  const previous = new Map();

  for (let i = 0; i <= endI; i++) {
    for (let j = 0; j <= endJ; j++) {
      const key = getKey(i, j);
      queue.push(key);
      distances.set(key, Number.POSITIVE_INFINITY);
      previous.set(key, null);
    }
  }
  distances.set(getKey(startI, startJ), 0);

  const findMinVertexIndex = () => {
    let minValue = Number.POSITIVE_INFINITY;
    let minVertexIndex = 0;
    queue.forEach((vertex, i) => {
      const distance = distances.get(vertex);
      if (distance < minValue) {
        minValue = distance;
        minVertexIndex = i;
      }
    });
    return minVertexIndex;
  };

  const getNeighbors = (vertex) => {
    const [i, j] = getCoords(vertex);
    const result = [];
    if (i > 0) {
      const up = getKey(i - 1, j);
      if (queue.indexOf(up) > -1) {
        result.push(up);
      }
    }
    if (i < endI) {
      const down = getKey(i + 1, j);
      if (queue.indexOf(down) > -1) {
        result.push(down);
      }
    }
    if (j > 0) {
      const left = getKey(i, j - 1);
      if (queue.indexOf(left) > -1) {
        result.push(left);
      }
    }
    if (j < endJ) {
      const right = getKey(i, j + 1);
      if (queue.indexOf(right) > -1) {
        result.push(right);
      }
    }
    return result;
  };

  const endKey = getKey(endI, endJ);

  while (queue.length > 0) {
    console.log("queue length", queue.length);
    const currentIndex = findMinVertexIndex();
    const current = queue[currentIndex];
    if (current === endKey) break;
    queue.splice(currentIndex, 1);
    const neighbors = getNeighbors(current);
    for (const vertex of neighbors) {
      const [nI, nJ] = getCoords(vertex);
      const newDistance = distances.get(current) + accessMap(nI, nJ);
      if (newDistance < distances.get(vertex)) {
        distances.set(vertex, newDistance);
        previous.set(vertex, current);
      }
    }
  }

  const length = distances.get(endKey);
  console.log("length", length);
})();
