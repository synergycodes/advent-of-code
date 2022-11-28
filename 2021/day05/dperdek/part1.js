const fs = require('fs');
const readline = require('readline');

(() => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream('data.txt')
    });

    const addPoint = (x, y) => {
        const key = `${x},${y}`;
        if (points[key]) {
            points[key]++;
        } else {
            points[key] = 1;
        }
    };

    const drawLine = ([x1, y1], [x2, y2]) => {
        const xStep = x1 < x2 ? 1 : -1;
        const yStep = y1 < y2 ? 1 : -1;
        const xDelta = Math.abs(x1 - x2);
        const yDelta = Math.abs(y1 - y2);

        for (let i = 0; xDelta && i <= xDelta; i++) {
            addPoint(x1 + i * xStep, y1);
        }

        for (let i = 0; yDelta && i <= yDelta; i++) {
            addPoint(x1, y1 + i * yStep);
        }
    };

    const lines = [];
    const points = {};

    lineReader.on('line', line => {
        lines.push(
            line.split(' -> ').map((x) => x.split(',').map((y) => parseInt(y)))
        );
    });

    lineReader.on('close', () => {
        const filteredLines = lines.filter(([p1, p2]) => p1[0] === p2[0] || p1[1] === p2[1]);

        filteredLines.forEach(([from, to]) => {
            drawLine(from, to);

        });

        const result = Object.keys(points).filter(key => points[key] > 1).length;

        console.log(result);
    });
})();
