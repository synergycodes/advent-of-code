const fs = require('fs');
const readline = require('readline');

(() => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream('data.txt')
    });

    const crabs = [];

    lineReader.on('line', line => {
        line.split(',').forEach(crab => crabs.push(Number(crab)));
    });

    lineReader.on('close', () => {
        const maxCoordinate = Math.max(...crabs);
        let minFuel = Number.POSITIVE_INFINITY;

        for (let i = 0; i < maxCoordinate; i++) {
            minFuel = Math.min(
                minFuel,
                crabs
                    .map(position => Math.abs(position - i))
                    .reduce((p, c) => p + c, 0),
            );
        }

        console.log(minFuel);
    });
})();
