'use strict';

const chalk = require('chalk');
const cliSpinners = require('cli-spinners');
const sharp = require('sharp');
const path = require('path');
const config = require('../config');
const fs = require('fs').promises;

async function getUncompressedTotalSize(files) {
	let totalUncompressedSize = 0;
	for (const { filePath } of files) {
		const stats = await fs.stat(filePath);
		totalUncompressedSize += stats.size;
	}
	return totalUncompressedSize;
}

async function compressImage(inputFilePath, outputDirectory) {
	const image = sharp(inputFilePath);
	const metadata = await image.metadata();

	if (config.supportedFormats.includes(metadata.format)) {
		const finalPath = `${outputDirectory}/${path.basename(inputFilePath)}`;
		const fileInfo = await image[metadata.format](
			config.compressionConfig[metadata.format]
		).toFile(finalPath);
		return { success: true, filePath: finalPath, size: fileInfo.size || 0 };
	}

	return { success: false };
}

async function convertToWebP(inputFilePath, outputDirectory) {
	const webPath = `${outputDirectory}/${path.basename(
		inputFilePath,
		path.extname(inputFilePath)
	)}.webp`;
	await sharp(inputFilePath)
		.webp(config.compressionConfig.webp)
		.toFile(webPath);
	return webPath;
}

module.exports = async function compress(files) {
	console.log(
		`${chalk.bgMagenta(
			`We skip images apart from ${config.supportedFormats.join(', ')} \n`
		)}`
	);

	const uncompressedTotalSize = await getUncompressedTotalSize(files);

	const startTime = Date.now();
	let totalCompressedSizeBytes = 0;

	const spinner = cliSpinners.dots;
	const spinnerInterval = setInterval(() => {
		process.stdout.write(
			`${chalk.yellow(
				spinner.frames[spinner.interval % spinner.frames.length]
			)} Processing files... \r`
		);
	}, spinner.interval);

	const compressPromises = files.map(
		async ({ outputDirectory, filePath }) => {
			try {
				const compressionResult = await compressImage(
					filePath,
					outputDirectory
				);
				if (compressionResult.success) {
					totalCompressedSizeBytes += compressionResult.size;

					console.log(
						`(${chalk.green('✔')}) ${chalk.green(
							'Successfully compressed: '
						)} ${chalk.blue(compressionResult.filePath)}`
					);
					await convertToWebP(filePath, outputDirectory);
					console.log(
						`(${chalk.green('✔')}) ${chalk.green(
							'Successfully converted to webp: '
						)} ${chalk.blue(filePath)}`
					);
				}
			} catch (err) {
				console.log(
					`${chalk.red.bold('Error:')} ${chalk.blue(
						filePath
					)} - ${chalk.red(err)}`
				);
			}
		}
	);

	await Promise.all(compressPromises);

	clearInterval(spinnerInterval);
	// console.log(`\n${chalk.green.bold('✔')} Processing completed!`);

	const endTime = Date.now();
	const timeTaken = (endTime - startTime) / 1000;
	const totalCompressedSizeMB = totalCompressedSizeBytes / (1024 * 1024);
	const uncompressedTotalSizeMB = uncompressedTotalSize / (1024 * 1024);
	const compressionPercentage =
		((uncompressedTotalSize - totalCompressedSizeBytes) /
			uncompressedTotalSize) *
		100;

	// Printing fixed percentage at the bottom
	// console.log(`${chalk.cyan.bold('Progress: 100%')}`);

	return {
		totalCompressedSizeMB,
		uncompressedTotalSizeMB,
		compressionPercentage,
		timeTaken
	};
};

// const chalk = require('chalk');
// const cliSpinners = require('cli-spinners');
// const sharp = require('sharp');
// const path = require('path');
// const config = require('../config');

// async function compressImage(inputFilePath, outputDirectory) {
// 	const image = sharp(inputFilePath);
// 	const metadata = await image.metadata();

// 	if (config.supportedFormats.includes(metadata.format)) {
// 		const finalPath = `${outputDirectory}/${path.basename(inputFilePath)}`;
// 		const fileInfo = await image[metadata.format](
// 			config.compressionConfig[metadata.format]
// 		).toFile(finalPath);
// 		return { success: true, filePath: finalPath, size: fileInfo.size || 0 };
// 	}

// 	return { success: false };
// }

// async function convertToWebP(inputFilePath, outputDirectory) {
// 	const webPath = `${outputDirectory}/${path.basename(
// 		inputFilePath,
// 		path.extname(inputFilePath)
// 	)}.webp`;
// 	await sharp(inputFilePath)
// 		.webp(config.compressionConfig.webp)
// 		.toFile(webPath);
// 	return webPath;
// }

// module.exports = async function compress(files) {
// 	console.clear();
// 	console.log(
// 		`${chalk.bgMagenta(
// 			`We skip images apart from ${config.supportedFormats.join(', ')} \n`
// 		)}`
// 	);

// 	const startTime = Date.now();
// 	let totalCompressedSizeBytes = 0;

// 	const spinner = cliSpinners.dots;
// 	const spinnerInterval = setInterval(() => {
// 		process.stdout.write(
// 			`${chalk.yellow(
// 				spinner.frames[spinner.interval % spinner.frames.length]
// 			)} Processing files... \r`
// 		);
// 	}, spinner.interval);

// 	const compressPromises = files.map(
// 		async ({ outputDirectory, filePath }) => {
// 			try {
// 				const compressionResult = await compressImage(
// 					filePath,
// 					outputDirectory
// 				);
// 				if (compressionResult.success) {
// 					totalCompressedSizeBytes += compressionResult.size;

// 					console.log(
// 						`(${chalk.green('✔')}) ${chalk.green(
// 							'Successfully compressed: '
// 						)} ${chalk.blue(compressionResult.filePath)}`
// 					);

// 					await convertToWebP(filePath, outputDirectory);
// 					console.log(
// 						`(${chalk.green('✔')}) ${chalk.green(
// 							'Successfully converted to webp: '
// 						)} ${chalk.blue(filePath)}`
// 					);
// 				}
// 			} catch (err) {
// 				console.log(
// 					`${chalk.red('Unable to process')}: ${chalk.blue(
// 						filePath
// 					)} --> ${chalk.red(err)}`
// 				);
// 			}
// 		}
// 	);

// 	await Promise.all(compressPromises);

// 	clearInterval(spinnerInterval);
// 	// console.log(`\n${chalk.green.bold('✔')} Processing completed!`);

// 	const endTime = Date.now();

// 	const totalCompressedSizeMB = totalCompressedSizeBytes / (1024 * 1024);
// 	const timeTaken = (endTime - startTime) / 1000;

// 	return { totalCompressedSizeMB, timeTaken };
// };
