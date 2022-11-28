const fs = require('fs');
const readline = require('readline');

(() => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream('data.txt')
    });

    const sumArray = arr => arr.reduce((p, c) => p + c, 0);

    let previousWindow = [];
    let currentWindow = [];
    let depthIncreases = 0;

    lineReader.on('line', line => {
        const currentDepth = Number(line);

        if (previousWindow.length < 1) {
            previousWindow.push(currentDepth);
            return;
        }

        if (previousWindow.length < 3) {
            previousWindow.push(currentDepth);
            currentWindow.push(currentDepth);
            return;
        }

        currentWindow.push(currentDepth);

        if (sumArray(currentWindow) > sumArray(previousWindow)) {
            depthIncreases++;
        }

        previousWindow = [...currentWindow];
        currentWindow = currentWindow.slice(-2);
    });

    lineReader.on('close', () => {
        console.log(depthIncreases);
    });
})();
