'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');

module.exports = async function (inputDir, outputDir) {
	try {
		await fs.copy(inputDir, outputDir, {
			// overwrite: false,
			// errorOnExist: true
		});
		console.log(chalk.bgGreen.bold('Done, Copying! \n'));

		return true;
		// console.log('success!');
	} catch (err) {
		console.error(chalk.bgRed(err));
		return false;
	}
};
