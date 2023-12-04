const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, { encoding: 'utf-8' });

let sum = 0;

for (const line of input.split('\n')) {
    if (line.length === 0) {
        console.log(sum);
        return;
    }

    const [game, showList] = line.split(':');
    const shows = showList.split(';');
    const total = {
        red: 0,
        green: 0,
        blue: 0
    };
    shows.forEach(show => {
       const balls = show.split(',').map(x => x.trim());
       balls.forEach(b => {
           const [count, color] = b.split(' ');
           total[color] = Math.max(total[color], Number(count));
       });
    });
    sum += total.red * total.green * total.blue;
}
