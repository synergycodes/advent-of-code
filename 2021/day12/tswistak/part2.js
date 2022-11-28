const { once } = require("events");
const fs = require("fs");
const readline = require("readline");

(async () => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(__dirname + "/data.txt"),
  });

  const graph = new Map();

  const addOrUpdate = (key, value) => {
    if (graph.has(key)) {
      graph.get(key).add(value);
    } else {
      graph.set(key, new Set([value]));
    }
  };

  lineReader.on("line", (line) => {
    const [from, to] = line.split("-");
    addOrUpdate(from, to);
    addOrUpdate(to, from);
  });

  await once(lineReader, "close");

  const isUppercased = (str) => str.toUpperCase() === str;

  const hasVisitedTwice = (route, node) => {
    const filtered = route.filter((x) => x === node);
    if ((filtered.length === 1 && node === "start") || filtered.length > 1) {
      return true;
    } else if (filtered.length === 0) {
      return false;
    }
    const lowercased = route.filter((x) => !isUppercased(x));
    for (const visited of lowercased) {
      const occurs = lowercased.filter((x) => x === visited).length;
      if (occurs > 1) {
        return true;
      }
    }
    return false;
  };

  const routes = [];

  const explore = (currentRoute) => {
    const current = currentRoute[currentRoute.length - 1];
    if (current === "end") {
      routes.push(currentRoute);
      // console.log(JSON.stringify(currentRoute), routes.length);
      return;
    }

    const past = currentRoute.slice(0, -1);
    if (!isUppercased(current) && hasVisitedTwice(past, current)) {
      return;
    }

    const possibilities = graph.get(current);

    for (const node of possibilities) {
      explore([...currentRoute, node]);
    }
  };

  explore(["start"]);

  console.log("routes", routes.length);
})();
