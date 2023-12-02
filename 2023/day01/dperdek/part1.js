const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, { encoding: 'utf-8' });

let sum = 0;

for (const line of input.split('\n')) {
    let first = -1;
    let last = -1;
    line.split('').forEach(c => {
        const n = Number(c);
        if (!isNaN(n)) {
            last = n;
            if (first < 0) {
                first = n;
            }
        }
    });
    if (first !== -1 && last !== -1) {
        sum += Number(`${first}${last}`);
    }
}

console.log(sum);
