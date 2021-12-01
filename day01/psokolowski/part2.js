const { depths } = require("./data");

const NUMBER_OF_MEASURMENT = 3;

(() => {
	let increasesCounter = 0;
	try {
		depths.forEach((item, index) => {
			const firstMeasurment =
				item + depths[index + 1] + depths[index + 2];
			const secondMeasurment =
				depths[index + 1] + depths[index + 2] + depths[index + 3];
			if (
				Number.isNaN(firstMeasurment) ||
				Number.isNaN(secondMeasurment)
			) {
				throw "there are no measurements to calculate the next one";
			}
			if (firstMeasurment < secondMeasurment) {
				increasesCounter++;
			}
		});
	} catch (err) {
		console.log(err);
	}
	console.log(`Increased ${increasesCounter} times`);
})();
