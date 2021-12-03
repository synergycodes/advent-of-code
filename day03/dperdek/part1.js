const fs = require('fs');
const readline = require('readline');

(() => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream('data.txt')
    });

    const negateRecord = record => {
        let newRecord = '';
        for (let i = 0; i < record.length; i++) {
            newRecord += record[i] === '1' ? '0' : '1';
        }

        return newRecord;
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
        const bitSum = Array(numberOfBits).fill(0);
        let finalRecord = '';

        data.forEach(record => {
            for (let i = 0; i < record.length; i++) {
                bitSum[i] += Number(record[i]);
            }
        });

        bitSum.forEach(sum => {
            finalRecord += sum > numberOfRecords / 2 ? '1' : '0';
        });

        const gamma = convertRecordToDec(finalRecord);
        const epsilon = convertRecordToDec(negateRecord(finalRecord));
        console.log(gamma * epsilon);
    });
})();
