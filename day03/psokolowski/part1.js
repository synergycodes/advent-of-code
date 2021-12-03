const { report } = require("./data");

(() => {
	const bits = report[0].split("");
	const gamma = [];

	bits.forEach((_, index) => {
		let numberOfPositiveBits = 0;
		let numberOfNegativeBits = 0;
		report.forEach((number) => {
			const bitValue = number.split("")[index];
			if (bitValue === "1") {
				numberOfPositiveBits++;
			} else {
				numberOfNegativeBits++;
			}
		});
		gamma.push(numberOfPositiveBits > numberOfNegativeBits ? 1 : 0);
	});

	const epsilon = gamma.map((number) => +!number);

	const power = parseInt(gamma.join(""), 2) * parseInt(epsilon.join(""), 2);
	console.log(power);
})();
