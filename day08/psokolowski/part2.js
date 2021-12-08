const fs = require("fs");
const readline = require("readline");

(() => {
	let input = [];
	const constLetters = ["a", "b", "c", "d", "e", "f", "g"];
	const pattern = [
		[0, 1, 2, 3, 4, 6],
		[0, 1],
		[0, 2, 3, 5, 6],
		[0, 1, 2, 3, 5],
		[0, 1, 4, 5],
		[1, 2, 3, 4, 5],
		[1, 2, 3, 4, 5, 6],
		[0, 1, 3],
		[0, 1, 2, 3, 4, 5, 6],
		[0, 1, 2, 3, 4, 5],
	];

	const lineReader = readline.createInterface({
		input: fs.createReadStream("data.txt"),
	});

	lineReader.on("line", (line) => {
		input.push(line.split(" | "));
	});

	lineReader.on("close", () => {
		let total = 0;
		input.forEach((segment) => {
			let linePattern = new Array(10).fill("");
			const [signal, digits] = segment;
			signal.split(" ").map((item) => {
				if (item.length === 7) linePattern[8] = item.split("");
				if (item.length === 4) linePattern[4] = item.split("");
				if (item.length === 3) linePattern[7] = item.split("");
				if (item.length === 2) linePattern[1] = item.split("");
			});

			signal.split(" ").map((item) => {
				if (item.length === 6) {
					const splittedItem = item.split("");
					const isSix =
						splittedItem.filter((letter) =>
							linePattern[1].includes(letter),
						).length === 1;
					if (isSix) {
						linePattern[6] = linePattern[8].filter((letter) =>
							splittedItem.includes(letter),
						);
					}
					const isZeroOrNine =
						splittedItem.filter((letter) =>
							linePattern[1].includes(letter),
						).length === 2;
					if (isZeroOrNine) {
						const letters = linePattern[4].filter((letter) =>
							splittedItem.includes(letter),
						);

						if (letters.length === 4) {
							linePattern[0] = splittedItem;
						} else {
							linePattern[9] = splittedItem;
						}
					}
				}
			});

			const salt = new Array(7).fill("");
			salt[1] = linePattern[6].filter((letter) =>
				linePattern[1].includes(letter),
			)[0];

			salt[0] = linePattern[1].filter(
				(letter) => !salt[1].includes(letter),
			)[0];

			salt[3] = linePattern[7].filter(
				(letter) => !linePattern[1].includes(letter),
			)[0];

			salt[5] = linePattern[0].filter(
				(letter) => !linePattern[9].includes(letter),
			)[0];

			salt[4] = linePattern[4]
				.filter((letter) => !linePattern[1].includes(letter))
				.filter((letter) => !salt[5].includes(letter))[0];

			salt[6] = linePattern[9].filter(
				(letter) => !linePattern[0].includes(letter),
			)[0];

			salt[2] = constLetters.filter(
				(letter) => !salt.includes(letter),
			)[0];

			// console.log(
			// 	`.${salt[3]}${salt[3]}.\n${salt[4]}..${salt[0]}\n${salt[4]}..${salt[0]}\n.${salt[5]}${salt[5]}.\n${salt[6]}..${salt[1]}\n${salt[6]}..${salt[1]}\n.${salt[2]}${salt[2]}.\n`,
			// );

			const result = digits.split(" ");
			let finalNumber = "";
			const listOfNumber = [];
			result.forEach((smallerSegment) => {
				listOfNumber.push(
					smallerSegment
						.split("")
						.map((letter) =>
							salt.findIndex((item) => item === letter),
						)
						.sort(),
				);
			});
			listOfNumber.forEach((number) => {
				const mappedNumber = pattern.findIndex(
					(test3) => JSON.stringify(test3) === JSON.stringify(number),
				);
				finalNumber += `${mappedNumber}`;
			});
			total += +finalNumber;
		});
		console.log(total);
	});
})();

//TODO: REFACTOR THAT!
