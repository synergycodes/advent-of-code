const fs = require('fs');
const readline = require('readline');

(() => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream('data.txt')
    });

    const simulationTime = 256;
    const inputPopulation = {};

    lineReader.on('line', line => {
        line.split(',').forEach(lanternfish => {
            if (inputPopulation[(Number(lanternfish))]) {
                inputPopulation[(Number(lanternfish))]++;
            } else {
                inputPopulation[(Number(lanternfish))] = 1;
            }
        });
    });

    lineReader.on('close', () => {
        let previousPopulation = {};
        let currentPopulation = { ...inputPopulation };

        const addOrUpdate = (key, value) =>
            key in currentPopulation
                ? (currentPopulation[key] = currentPopulation[key] + value)
                : (currentPopulation[key] = value);

        for (let i = 0; i < simulationTime; i++) {
            previousPopulation = { ...currentPopulation };
            currentPopulation = {};

            for (const key in previousPopulation) {
                const count = previousPopulation[key];
                const daysToGiveBirth = Number(key);
                if (daysToGiveBirth === 0) {
                    addOrUpdate(8, count);
                    addOrUpdate(6, count);
                } else {
                    addOrUpdate(daysToGiveBirth - 1, count);
                }
            }
        }

        const population = Object.keys(currentPopulation).map(key => currentPopulation[key]).reduce((p, c) => p + c, 0);
        console.log(`Population: ${population}`);
    });
})();
