const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const files = {
  "/": {},
};
let current = files;

for (const line of input.split("\n")) {
  if (line.startsWith("$")) {
    const [_, cmd, arg] = line.split(" ");
    if (cmd === "cd") {
      current = current[arg];
    }
  } else {
    const [size, name] = line.split(" ");
    if (size === "dir") {
      current[name] = {
        "..": current,
      };
    } else {
      current[name] = parseInt(size);
    }
  }
}

const dirSizes = {};

const getDirSizes = (dir, dirName) => {
  let result = 0;
  for (const [name, sizeOrChild] of Object.entries(dir)) {
    if (name === "..") {
      continue;
    }
    if (typeof sizeOrChild === "number") {
      result += sizeOrChild;
    } else {
      result += getDirSizes(sizeOrChild, dirName + "/" + name);
    }
  }
  dirSizes[dirName] = result;
  return result;
};

getDirSizes(files["/"], "/");

const limit = 70000000;
const neededFree = 30000000;
const totalSize = dirSizes["/"];
const currentFree = limit - totalSize;
const toRemove = neededFree - currentFree;

const sorted = Object.values(dirSizes).sort((a, b) => a - b);
for (const val of sorted) {
  const diff = val - toRemove;
  console.log(diff, val);
  if (diff >= 0) {
    break;
  }
}
