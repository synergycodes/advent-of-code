const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, { encoding: 'utf-8' });

const getPriority = (char) => {
  const code = char.codePointAt(0);
  return code >= 97 && code <= 122 ? code - 96 : code - 38;
}

let result = 0;
let lineCount = 0;
let charMap = {};
let group = ['', '', ''];

for (const line of input.split('\n')) {
  group[lineCount] = line;
  lineCount++;

  if (lineCount === 3) {
    [...group[0]].forEach(c => {
      charMap[c] = 1;
    });
    [...group[1]].forEach(c => {
      if (charMap[c] === 1) {
        charMap[c]++;
      }
    });
    [...group[2]].forEach(c => {
      if (charMap[c] === 2) {
        charMap[c]++;
      }
    });

    Object.keys(charMap).some(c => {
      if (charMap[c] === 3) {
        result += getPriority(c);
        return true;
      }
      return false;
    });

    lineCount = 0;
    group = ['', '', ''];
    charMap = {};
  }
}

console.log(result);
