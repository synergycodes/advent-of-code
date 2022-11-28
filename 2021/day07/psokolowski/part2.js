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
		const horizontalMax = Math.max(...input);
		let optimal = Number.POSITIVE_INFINITY;

		for (let number = 0; number < horizontalMax; number++) {
			const current = input.map((position) => {
				const result = Math.abs(position - number);
				return (result * (result + 1)) / 2;
			});
			const sum = current.reduce(
				(previous, current) => previous + current,
			);
			optimal = Math.min(sum, optimal);
		}
		console.log(optimal);
	});
})();
