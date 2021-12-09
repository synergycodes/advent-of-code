const fs = require("fs");
const readline = require("readline");

(() => {
	let input = [];
	const numberOfSegments = [4, 3, 2, 7];

	const lineReader = readline.createInterface({
		input: fs.createReadStream("data.txt"),
	});

	lineReader.on("line", (line) => {
		input.push(line);
	});

	lineReader.on("close", () => {
		let result = 0;
		input.forEach((number, index) => {
			const lineInput = number.split("");

			lineInput.forEach((lineNumber, lineIndex) => {
				let adjecentNumbers = [];
				if (index - 1 >= 0) {
					adjecentNumbers.push(+input[index - 1][lineIndex]);
				}
				if (lineIndex + 1 <= lineInput.length - 1) {
					adjecentNumbers.push(+lineInput[lineIndex + 1]);
				}
				if (index + 1 <= input.length - 1) {
					const nextLine = input[+index + 1];
					adjecentNumbers.push(+nextLine[lineIndex]);
				}
				if (lineIndex - 1 >= 0) {
					adjecentNumbers.push(+lineInput[lineIndex - 1]);
				}

				const isLow = Math.min(...adjecentNumbers, lineNumber);
				const notSameAsAdjecent = !adjecentNumbers.includes(
					+lineNumber,
				);
				if (isLow === +lineNumber && notSameAsAdjecent) {
					result = result + (+lineNumber + 1);
				}
			});
		});
		console.log(result);
	});
})();
