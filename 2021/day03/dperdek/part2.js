const fs = require('fs');
const readline = require('readline');

(() => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream('data.txt')
    });

    const countPositiveBits = (arr, bitIndex) => {
        return arr.filter(record => {
            return record[bitIndex] === '1';
        }).length;
    }

    const filterByBitValue = (arr, bitIndex, bitValue) => {
        return arr.filter(record => {
            return record[bitIndex] === bitValue;
        });
    };

    const convertRecordToDec = record => {
        let result = 0;
        for (let i = record.length - 1; i >= 0; i--) {
            result += Number(record[i]) * Math.pow(2, record.length - 1 - i);
        }

        return result;
    };

    const data = [];

    lineReader.on('line', line => {
        data.push(line);
    });

    lineReader.on('close', () => {
        const numberOfRecords = data.length;
        const numberOfBits = data[0].length;

        let oxygenRating = [...data];
        let co2Rating = [...data];

        // startujemy od pełnej listy
        // dla każdego bitu trzeba przejść całą obecną listę
        // zostawiamy rekordy z tym bitem którego jest więcej na danej pozycji
        // jak jest remis to bierzemy oxygen - 1, co2 - 0
        // robimy tak długo aż będzie tylko jeden rekord

        for (let i = 0; i < numberOfBits && oxygenRating.length > 1; i++) {
            oxygenRating = filterByBitValue(
                oxygenRating,
                i,
                countPositiveBits(oxygenRating, i) >= oxygenRating.length / 2 ? '1' : '0'
            );
        }

        for (let i = 0; i < numberOfBits && co2Rating.length > 1; i++) {
            co2Rating = filterByBitValue(
                co2Rating,
                i,
                countPositiveBits(co2Rating, i) >= co2Rating.length / 2 ? '0' : '1'
            );
        }

        const oxygen = convertRecordToDec(oxygenRating[0]);
        const co2 = convertRecordToDec(co2Rating[0]);
        console.log(oxygen * co2);
    });
})();
