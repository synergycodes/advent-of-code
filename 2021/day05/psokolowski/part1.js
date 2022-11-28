const fs = require("fs");
const readline = require("readline");

(() => {
	const diagram = [];
	const input = [];
	const maxSize = { x: 0, y: 0 };
	const lineReader = readline.createInterface({
		input: fs.createReadStream("data.txt"),
	});

	lineReader.on("line", (line) => {
		const [first, second] = line.split(" -> ");
		const firstPoint = first.split(",");
		const secondPoint = second.split(",");

		maxSize.x = Math.max(maxSize.x, firstPoint[0], secondPoint[0]);
		maxSize.y = Math.max(maxSize.y, firstPoint[1], secondPoint[1]);

		input.push({
			firstPoint,
			secondPoint,
		});
	});

	lineReader.on("close", () => {
		for (let row = 0; row <= maxSize.x; row++) {
			diagram.push([]);
			for (let column = 0; column <= maxSize.y; column++) {
				diagram[row].push(".");
			}
		}

		input.forEach(({ firstPoint, secondPoint }) => {
			if (firstPoint[0] === secondPoint[0]) {
				const biggerY = Math.max(firstPoint[1], secondPoint[1]);
				const smallerY = Math.min(firstPoint[1], secondPoint[1]);
				for (let y = smallerY; y <= biggerY; y++) {
					const point = diagram[firstPoint[0]][y];
					if (point === ".") {
						diagram[firstPoint[0]][y] = 1;
					} else {
						diagram[firstPoint[0]][y]++;
					}
				}
			} else if (firstPoint[1] === secondPoint[1]) {
				const biggerX = Math.max(firstPoint[0], secondPoint[0]);
				const smallerX = Math.min(firstPoint[0], secondPoint[0]);
				for (let x = smallerX; x <= biggerX; x++) {
					const point = diagram[x][firstPoint[1]];
					if (point === ".") {
						diagram[x][firstPoint[1]] = 1;
					} else {
						diagram[x][firstPoint[1]]++;
					}
				}
			}
		});
		console.log(diagram.flat().filter((item) => item > 1).length);
	});
})();
