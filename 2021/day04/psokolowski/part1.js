const fs = require("fs");
const readline = require("readline");

(() => {
	const lineReader = readline.createInterface({
		input: fs.createReadStream("data.txt"),
	});

	const boards = [];
	let input = [];
	let boardIndex = 0;
	let rowLength = 0;

	const checkRows = (board) => {
		const boardCopy = [...board];
		while (boardCopy.length) {
			const row = boardCopy.splice(0, rowLength);
			if (row.filter((item) => item.checked).length === row.length) {
				return true;
			}
		}
	};

	const checkColumns = (board) => {
		const boardCopy = [...board];
		for (let columnNumber = 0; columnNumber < rowLength; columnNumber++) {
			const column = boardCopy.filter((item, index) => {
				return (index + columnNumber) % rowLength === 0;
			});

			if (
				column.filter((record) => record.checked).length ===
				column.length
			) {
				return true;
			}
		}
	};

	lineReader.on("line", (line) => {
		if (!input.length) {
			input = line.split(",");
		} else {
			if (!!line.length) {
				const newArray = line
					.split(" ")
					.filter((item) => item.length)
					.map((item) => ({ number: item, checked: false }));
				rowLength = newArray.length;
				boards[boardIndex - 1].push(...newArray);
			} else {
				boards[boardIndex++] = [];
			}
		}
	});
	lineReader.on("close", () => {
		try {
			while (input.length) {
				const hit = input.splice(0, 1)[0];
				boards.forEach((board) => {
					board.forEach((item) => {
						if (hit === item.number) {
							item.checked = true;
							if (checkRows(board) || checkColumns(board)) {
								throw { board, hit };
							}
						}
					});
				});
			}
		} catch ({ board, hit }) {
			const result = board.filter((item) => !item.checked);
			const scores = result
				.map((item) => +item.number)
				.reduce((previous, current) => +previous + +current);
			console.log(scores * hit);
		}
	});
})();
