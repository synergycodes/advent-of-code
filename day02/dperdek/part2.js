const fs = require('fs');
const readline = require('readline');

(() => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream('data.txt')
    });

    let position = 0;
    let depth = 0;
    let aim = 0;

    lineReader.on('line', line => {
        const [command, valueAsText] = line.split(' ');
        const value = Number(valueAsText);

        switch (command) {
            case 'forward':
                position += value;
                depth += aim * value;
                break;
            case 'up':
                aim -= value;
                break;
            case 'down':
                aim += value;
                break;
            default:
                console.log('invalid command');
        }
    });

    lineReader.on('close', () => {
        console.log(`position: ${position} * depth: ${depth} = ${position * depth}`);
    });
})();
