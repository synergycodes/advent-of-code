const fs = require("fs");
const readline = require("readline");

(() => {
	let input = [];

	const lineReader = readline.createInterface({
		input: fs.createReadStream("data.txt"),
	});

	lineReader.on("line", (line) => {
		input = line.split(",");
	});

	lineReader.on("close", () => {
		for (let day = 0; day < 80; day++) {
			input.forEach((_, index) => {
				input[index]--;

				if (input[index] < 0) {
					input[index] = 6;
					input.push(8);
				}
			});
		}
		console.log(input.length);
	});
})();
