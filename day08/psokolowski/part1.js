const fs = require("fs");
const readline = require("readline");

(() => {
	let input = [];
	const numberOfSegments = [4, 3, 2, 7];

	const lineReader = readline.createInterface({
		input: fs.createReadStream("data.txt"),
	});

	lineReader.on("line", (line) => {
		input.push(line.split(" | ")[1]);
	});

	lineReader.on("close", () => {
		let result = 0;
		input.forEach((segment) => {
			result += segment
				.split(" ")
				.filter((segment) =>
					numberOfSegments.includes(segment.length),
				).length;
		});
		console.log(result);
	});
})();
