const { report } = require("./data");

(() => {
	const bits = report[0].split("");
	let oxygen = [...report];
	let co2 = [...report];

	const calculate = (data, index, bigger = true) => {
		let positiveValues = [];
		let negativeValues = [];
		data.forEach((number) => {
			const bitValue = number.split("")[index];
			if (bitValue === "1") {
				positiveValues.push(number);
			} else {
				negativeValues.push(number);
			}
		});

		if (data.length > 1) {
			if (bigger) {
				return positiveValues.length >= negativeValues.length
					? positiveValues
					: negativeValues;
			}
			return positiveValues.length < negativeValues.length
				? positiveValues
				: negativeValues;
		}
		return data;
	};

	bits.forEach((_, index) => {
		oxygen = calculate(oxygen, index);
		co2 = calculate(co2, index, false);
	});

	const power = parseInt(oxygen.join(""), 2) * parseInt(co2.join(""), 2);
	console.log(power);
})();
