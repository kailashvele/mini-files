module.exports = {
	compressionConfig: {
		jpeg: { quality: 70, mozjpeg: true },
		webp: { quality: 70 },
		png: { quality: 70, compressionLevel: 8 }
	},
	supportedFormats: ['jpeg', 'jpg', 'png', 'webp']
};
