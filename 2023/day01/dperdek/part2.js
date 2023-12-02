const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, { encoding: 'utf-8' });

let sum = 0;
const digitNames = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const replaceDigitNames = (inputString) => {
    const pattern = new RegExp(digitNames.join('|'), 'g');
    return inputString.replace(pattern, match => {
        const digitIndex = digitNames.indexOf(match);
        return `${digitIndex+1}${digitNames[digitIndex].slice(-1)}`;
    });
};

for (const line of input.split('\n')) {
    let first = -1;
    let last = -1;
    const replacedLine = replaceDigitNames(replaceDigitNames(line));
    replacedLine.split('').forEach(c => {
        const n = Number(c);
        if (!isNaN(n)) {
            last = n;
            if (first === -1) {
                first = n;
            }
        }
    });
    if (first !== -1 && last !== -1) {
        sum += Number(`${first}${last}`);
        console.log(line, replacedLine, Number(`${first}${last}`));
    }
}

console.log(sum);
