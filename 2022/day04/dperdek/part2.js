const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, { encoding: 'utf-8' });

let result = 0;

for (const line of input.split('\n')) {
    const [start1, end1, start2, end2] = line
        .split(/,|-/)
        .map((x) => parseInt(x));
    if (
        start1 >= start2 && start1 <= end2 ||
        start2 >= start1 && start2 <= end1
    ) {
        result++;
    }
}

console.log(result);
