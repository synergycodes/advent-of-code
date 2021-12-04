const fs = require('fs');
const readline = require('readline');

(() => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream('data.txt')
    });

    const checkForWinner = hitsBoard => {
        let result = false;

        for (let i = 0; i < boardSize * boardSize && !result; i += boardSize) {
            let rowSum = 0;
            for (let j = i; j < i + boardSize; j++) {
                rowSum += hitsBoard[j];
            }
            result = rowSum === boardSize;
        }

        for (let i = 0; i < boardSize && !result; i++) {
            let columnSum = 0;
            for (let j = 0; j < boardSize; j++) {
                columnSum += hitsBoard[i + j * boardSize];
            }
            result = columnSum === boardSize;
        }

        return result;
    };

    const input = [];
    const boards = [];
    const hits = [];
    const boardSize = 5;
    let startNewBoard = false;
    let currentBoardIndex = -1;
    let winnerBoardIndex = -1;
    let winningNumber = -1;

    lineReader.on('line', line => {
        if (input.length === 0) {
            line.split(',').forEach(num => input.push(Number(num)));
            return;
        }

        if (line === '') {
            currentBoardIndex++;
            startNewBoard = true;
            return;
        }

        const numbers = line.split(' ').filter(Boolean);

        if (numbers.length === 0) {
            return;
        }

        if (startNewBoard) {
            boards.push([]);
            hits.push([]);
            startNewBoard = false;
        }

        numbers.forEach(num => {
            boards[currentBoardIndex].push(Number(num));
            hits[currentBoardIndex].push(0);
        });
    });

    lineReader.on('close', () => {
        input.forEach(num => {
            boards.forEach((board, boardIndex) => {
                board.forEach((x, i) => {
                    if (winnerBoardIndex >= 0) {
                        return;
                    }

                    if (num === x) {
                        hits[boardIndex][i] = 1;
                        if (checkForWinner(hits[boardIndex])) {
                            winnerBoardIndex = boardIndex;
                            winningNumber = num;
                        }
                    }
                });
            });
        });

        const unmarkedNumbersSum = hits[winnerBoardIndex].map((x, i) => x === 0 ? boards[winnerBoardIndex][i] : 0).reduce((p, c) => p + Number(c), 0);
        const result = unmarkedNumbersSum * winningNumber;

        console.log(result);
    });
})();
