const { directions } = require("./data");

(() => {
	let depth = 0;
	let horizontalPosition = 0;
	let aim = 0;

	directions.forEach((direction) => {
		const [name, value] = direction.split(" ");
		if (name === "forward") {
			horizontalPosition += +value;
			depth += aim * +value;
		} else if (name === "up") {
			aim -= +value;
		} else if (name === "down") {
			aim += +value;
		}
	});

	console.log(
		`Multiplying these together produces ${depth * horizontalPosition}`,
	);
})();
