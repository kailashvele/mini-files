const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	inputDir: {
		type: `string`,
		alias: `iD`,
		desc: `Input Directory`
	},
	outputDir: {
		type: `string`,
		alias: `oD`,
		default: `MinifiedImages`,
		desc: `Output Directory`
	}
};

const commands = {
	help: { desc: `Print help info` },
	compress: { desc: `Compress images and convert images to webp` }
};

const helpText = meowHelp({
	name: `minfi`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
