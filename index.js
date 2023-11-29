#!/usr/bin/env node

/**
 * mini-files
 * To help optimize or convert images recursively
 *
 * @author Kai <https://twitter.com/kailashvele>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const compress = require('./lib/compress');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

const getFiles = require('./lib/getFiles');
const chalk = require('chalk');
const replicate = require('./lib/replicate');

(async () => {
	init({ clear });
	input.includes('help') && cli.showHelp(0);

	debug && log(flags);

	if (input.includes('compress')) {
		if (!flags.inputDir) {
			console.log(
				`${chalk.bgMagenta(`Please provide Input directory! \n\n`)}`
			);
			return;
		}

		const replication = await replicate(flags.inputDir, flags.outputDir);

		if (replication) {
			const files = await getFiles(flags.inputDir, flags.outputDir, []);

			console.log(
				`${chalk.bold.blue('Total Files:')} ${chalk.bgBlue.bold(
					files.length
				)} \n`
			);

			if (files.length) {
				const {
					totalCompressedSizeMB,
					timeTaken,
					uncompressedTotalSizeMB,
					compressionPercentage
				} = await compress(files);

				console.log(
					`${chalk.green.bold(
						'✔'
					)} Processing completed! Total files processed: ${chalk.blue.bold(
						files.length
					)}`
				);
				console.log(
					`${chalk.green.bold(
						'✔'
					)} Total size of uncompressed files: ${chalk.blue.bold(
						uncompressedTotalSizeMB.toFixed(2)
					)} ${chalk.blue('MB')}`
				);
				console.log(
					`${chalk.green.bold(
						'✔'
					)} Total size of compressed files: ${chalk.blue.bold(
						totalCompressedSizeMB.toFixed(2)
					)} ${chalk.blue('MB')}`
				);
				console.log(
					`${chalk.green.bold(
						'✔'
					)} Compression in percentage: ${chalk.blue.bold(
						compressionPercentage.toFixed(2)
					)}%`
				);

				console.log(
					`${chalk.green.bold(
						'✔'
					)} Time taken for compression: ${chalk.blue.bold(
						timeTaken.toFixed(2)
					)} ${chalk.blue('seconds')}`
				);
			}
		}
	}
})();
