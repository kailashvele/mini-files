'use strict';

const chalk = require('chalk');
const sharp = require('sharp');
const path = require('path');
const config = require('../config');

module.exports = async function (files) {
	console.log(
		`${chalk.bgMagenta(
			`We skip images apart from ${config.supportedFormats.join(', ')} \n`
		)}`
	);

	files.forEach(async function ({ outputDirectory, filePath }, index) {
		try {
			const image = sharp(filePath);
			const meta = await image.metadata();
			const { format } = meta;

			if (config.supportedFormats.includes(format)) {
				const finalPath = path.join(
					outputDirectory,
					path.basename(filePath)
				);

				image[format](config.compressionConfig[format]).toFile(
					finalPath,
					(err, info) => {
						// console.log(info);
						if (err === null) {
							console.log(
								`(${chalk.green(index + 1)}) ${chalk.green(
									'Successfully compressed: '
								)} ${chalk.blue(filePath)}`
							);
						} else {
							console.log(
								chalk.red(
									`\n (${index + 1}) ${err} : ${filePath} \n`
								)
							);
							// throw err;
						}
					}
				);

				if (format !== 'webp') {
					const webPath = path.join(
						outputDirectory,
						path.basename(filePath, path.extname(filePath)) +
							'.webp'
					);

					sharp(filePath)
						.webp(config.compressionConfig.webp)
						.toFile(webPath, (err, info) => {
							if (err === null) {
								console.log(
									`(${chalk.green(index + 1)}) ${chalk.green(
										'Successfully converted to webp: '
									)} ${chalk.blue(filePath)} ---> ${webPath}`
								);
							} else {
								console.log(
									chalk.red(
										`\n (${
											index + 1
										}) ${err} : ${filePath} \n`
									)
								);
								// throw err;
							}
						});
				}
			}
		} catch (err) {
			console.log(
				`(${index + 1}) ${chalk.red('Unable to process')}: ${chalk.blue(
					filePath
				)} --> ${chalk.red(err)}`
			);
		}
	});
};
