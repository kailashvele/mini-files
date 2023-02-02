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

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);
})();