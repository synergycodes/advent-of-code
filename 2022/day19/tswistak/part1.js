const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", { encoding: "utf-8" });

const blueprints = new Map();

// parse input
for (const line of input.split("\n")) {
  const [_, id, ore, clay, obsidianOre, obsidianClay, geodeOre, geodeObsidian] =
    line
      .match(
        /^Blueprint (\d+): .* costs (\d+) ore.* costs (\d+) ore.* (\d+) ore and (\d+) clay.* (\d+) ore and (\d+) obsidian\.$/
      )
      .map((x) => parseInt(x));

  blueprints.set(id, {
    ore,
    clay,
    obsidianOre,
    obsidianClay,
    geodeOre,
    geodeObsidian,
  });
}

// find result
const ORE_ROBOT = 0;
const CLAY_ROBOT = 1;
const OBSIDIAN_ROBOT = 2;
const GEODE_ROBOT = 3;
const robots = [ORE_ROBOT, CLAY_ROBOT, OBSIDIAN_ROBOT, GEODE_ROBOT];

let result = 0;
for (const [id, blueprint] of blueprints) {
  const { ore, clay, obsidianOre, obsidianClay, geodeOre, geodeObsidian } =
    blueprint;
  const neededOreRobots = Math.max(ore, clay, obsidianOre, geodeOre);
  const neededClayRobots = obsidianClay;
  const neededObsidianRobots = geodeObsidian;

  let maxResult = Number.NEGATIVE_INFINITY;

  // consider all solutions as a graph and do search on it
  const dfs = (
    time,
    type,
    oreRobots,
    clayRobots,
    obsidianRobots,
    geodeRobots,
    oreCurrent,
    clayCurrent,
    obsidianCurrent,
    geodeCurrent
  ) => {
    if (
      (type === ORE_ROBOT && oreRobots >= neededOreRobots) ||
      (type === CLAY_ROBOT && clayRobots >= neededClayRobots) ||
      (type === OBSIDIAN_ROBOT &&
        (obsidianRobots >= neededObsidianRobots || clayRobots === 0)) ||
      (type === GEODE_ROBOT && obsidianRobots === 0) ||
      // based on https://www.reddit.com/r/adventofcode/comments/zpihwi/comment/j0tls7a/?utm_source=share&utm_medium=web2x&context=3
      geodeCurrent + geodeRobots * time + Math.floor(((time - 1) * time) / 2) <=
        maxResult
    ) {
      return;
    }
    while (time > 0) {
      if (type === ORE_ROBOT && oreCurrent >= ore) {
        robots.forEach((r) =>
          dfs(
            time - 1,
            r,
            oreRobots + 1,
            clayRobots,
            obsidianRobots,
            geodeRobots,
            oreCurrent - ore + oreRobots,
            clayCurrent + clayRobots,
            obsidianCurrent + obsidianRobots,
            geodeCurrent + geodeRobots
          )
        );
      } else if (type === CLAY_ROBOT && oreCurrent >= clay) {
        robots.forEach((r) =>
          dfs(
            time - 1,
            r,
            oreRobots,
            clayRobots + 1,
            obsidianRobots,
            geodeRobots,
            oreCurrent - clay + oreRobots,
            clayCurrent + clayRobots,
            obsidianCurrent + obsidianRobots,
            geodeCurrent + geodeRobots
          )
        );
      } else if (
        type === OBSIDIAN_ROBOT &&
        oreCurrent >= obsidianOre &&
        clayCurrent >= obsidianClay
      ) {
        robots.forEach((r) =>
          dfs(
            time - 1,
            r,
            oreRobots,
            clayRobots,
            obsidianRobots + 1,
            geodeRobots,
            oreCurrent - obsidianOre + oreRobots,
            clayCurrent - obsidianClay + clayRobots,
            obsidianCurrent + obsidianRobots,
            geodeCurrent + geodeRobots
          )
        );
      } else if (
        type === GEODE_ROBOT &&
        oreCurrent >= geodeOre &&
        obsidianCurrent >= geodeObsidian
      ) {
        robots.forEach((r) =>
          dfs(
            time - 1,
            r,
            oreRobots,
            clayRobots,
            obsidianRobots,
            geodeRobots + 1,
            oreCurrent - geodeOre + oreRobots,
            clayCurrent + clayRobots,
            obsidianCurrent - geodeObsidian + obsidianRobots,
            geodeCurrent + geodeRobots
          )
        );
      } else {
        oreCurrent += oreRobots;
        clayCurrent += clayRobots;
        obsidianCurrent += obsidianRobots;
        geodeCurrent += geodeRobots;
        time--;
      }
    }
    maxResult = Math.max(maxResult, geodeCurrent);
  };

  robots.forEach((r) => dfs(24, r, 1, 0, 0, 0, 0, 0, 0, 0));
  result += id * maxResult;
}

console.log(result);
