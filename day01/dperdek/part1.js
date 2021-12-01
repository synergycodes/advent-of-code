const fs = require('fs');
const readline = require('readline');

(() => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream('data.txt')
    });

    let previousDepth = null;
    let depthIncreases = 0;

    lineReader.on('line', line => {
        const currentDepth = Number(line);

        if (previousDepth === null) {
            previousDepth = currentDepth;
            return;
        }

        if (currentDepth > previousDepth) {
            depthIncreases++;
        }

        previousDepth = currentDepth;
    });

    lineReader.on('close', () => {
        console.log(depthIncreases);
    });
})();
