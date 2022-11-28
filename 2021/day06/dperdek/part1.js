const fs = require('fs');
const readline = require('readline');

(() => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream('data.txt')
    });

    const simulationTime = 80;
    let population = [];
    let babyLanternfishCount = 0;

    lineReader.on('line', line => {
        line.split(',').forEach(lanternfish => population.push(Number(lanternfish)));
    });

    lineReader.on('close', () => {
        console.log(`Initial state: ${population}`);

        for (let i = 0; i < simulationTime; i++) {
            population = population.map(lanternfish => {
                if (lanternfish === 0) {
                    babyLanternfishCount++;
                    return 6;
                }
                return lanternfish - 1;
            });
            for (let j = 0; j < babyLanternfishCount; j++) {
                population.push(8);
            }
            babyLanternfishCount = 0;
        }

        console.log(`Population: ${population.length}`);
    });
})();
