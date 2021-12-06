const fs = require("fs");
const readline = require("readline");

(() => {
	let input = [];

	const lineReader = readline.createInterface({
		input: fs.createReadStream("data.txt"),
	});

	lineReader.on("line", (line) => {
		input = new Array(9).fill(0);
		line.split(",").forEach((number) => {
			if (!!input[number]) {
				input[number]++;
			} else {
				input[number] = 1;
			}
		});
	});

	lineReader.on("close", () => {
		let previous = [];
		let current = [...input];
		console.log(current);
		for (let day = 0; day < 256; day++) {
			previous = [...current];
			current = new Array(9).fill(0);
			for (const key in previous) {
				if (+key === 0) {
					current[+key] = previous[+key + 1];
					current[8] = current[8] + previous[+key];
					current[6] = current[6] + previous[+key];
				} else if (+key !== 8) {
					current[+key] = current[+key] + previous[+key + 1];
				}
			}
		}
		const result = current.reduce(
			(previous, current) => previous + current,
		);

		console.log(result);
	});
})();
