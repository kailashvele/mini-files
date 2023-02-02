'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

// Array of files with their paths to avoid going through to compress and conver in one go later.
const getFiles = (inputDir, outputDir, arrayOfFiles = []) => {
	try {
		const files = fs.readdirSync(inputDir);

		files.forEach(function (file) {
			if (fs.statSync(inputDir + '/' + file).isDirectory()) {
				arrayOfFiles = getAllFiles(
					`${inputDir}/${file}`,
					`${outputDir}/${file}`,
					arrayOfFiles
				);
			} else {
				arrayOfFiles.push({
					directory: path.join(inputDir, '/'),
					outputDirectory: path.join(outputDir),
					filePath: path.join(inputDir, '/', file)
				});
			}
		});

		return arrayOfFiles;
	} catch (err) {
		console.log(chalk.red('Unable to scan directory: ' + err));

		return [];
	}
};

module.exports = getFiles;
