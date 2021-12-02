const { directions } = require("./data");

(() => {
	let depth = 0;
	let horizontalPosition = 0;

	directions.forEach((direction) => {
		const [name, value] = direction.split(" ");
		if (name === "forward") {
			horizontalPosition += +value;
		} else if (name === "up") {
			depth -= +value;
		} else if (name === "down") {
			depth += +value;
		}
	});

	console.log(
		`Multiplying these together produces ${depth * horizontalPosition}`,
	);
})();
