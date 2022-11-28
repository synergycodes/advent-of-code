// data: target area: x=32..65, y=-225..-177
const minX = 32;
const maxX = 65;
const minY = -225;
const maxY = -177;

const velocitiesY = [];
const velocitiesX = [];

// filling velocities tables
for (let i = 1; i <= maxX; i++) {
  velocitiesX.push(i);
}

for (let i = minY; i <= Math.abs(minY); i++) {
  velocitiesY.push(i);
}

const isOnTarget = (velX, velY) => {
  let i = velX;
  let j = velY;
  let x = 0;
  let y = 0;
  while (x <= maxX && y >= minY) {
    if (x >= minX && y <= maxY) {
      return true;
    }
    x += i;
    y += j;
    if (i !== 0) {
      i--;
    }
    j--;
  }
  return false;
};

let count = 0;
for (const velY of velocitiesY) {
  for (const velX of velocitiesX) {
    if (isOnTarget(velX, velY)) {
      count++;
    }
  }
}

console.log("count", count);
