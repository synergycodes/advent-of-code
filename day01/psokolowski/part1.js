const { depths } = require("./data");

(() => {
	let increasesCounter = 0;

	depths.reduce((previous, current) => {
		if (previous < current) {
			increasesCounter++;
		}
		return current;
	});
	console.log(`Increased ${increasesCounter} times`);
})();
