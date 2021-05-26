const mergeSvgFiles = require('./mergeSvgFiles')
const getTransforms = require('./getTransforms')
const getCentroids = require('./getCentroids')
const injectSvgFiles = require('./injectSvgFiles')
const svgToPdf = require('../svgToPdf')
const path = require('path')
const fs = require('fs')
const Sat = require('../sat/Sat')
const constructCover = require('./constructCover')

async function nestSvgFiles(fileNameArray, {
	output: { path: outputPath, name: outputName, svg: outputSvg },
	centralImage,
	coverImage,
	margin
}){
	var mergedSvgStr = await mergeSvgFiles(fileNameArray, centralImage)
	var sortedSvgStr = await (new Sat(mergedSvgStr)).start()
	var centroids = getCentroids(sortedSvgStr)
	//console.log(sortedSvgStr)
	var transformsSvgStr = getTransforms(sortedSvgStr)
	var finalSvgStr = await injectSvgFiles(fileNameArray, transformsSvgStr, centralImage, centroids, margin)

	if(outputSvg){
		fs.writeFileSync(
			path.format({ dir: outputPath, name: outputName, ext: '.svg' }), 
			finalSvgStr 
		);
	}

	var coverSvgStr = await constructCover(coverImage)

	svgToPdf(coverSvgStr, finalSvgStr, path.format({
		dir: outputPath, name: outputName, ext: '.pdf'
	}))
}

nestSvgFiles([
	"node_converter_all/signatures/603/1614019007219.svg",
	"node_converter_all/signatures/604/1614153699924.svg",
	"node_converter_all/signatures/605/1614154423375.svg",
	"node_converter_all/signatures/606/1614154868780.svg",
	"node_converter_all/signatures/607/1614154961714.svg",
	"node_converter_all/signatures/608/1614155051231.svg",
	"node_converter_all/signatures/609/1614155171536.svg",
	"node_converter_all/signatures/610/1614155634258.svg",
	"node_converter_all/signatures/611/1614155822076.svg",
	"node_converter_all/signatures/612/1614155921476.svg",
	"node_converter_all/signatures/613/1614168216007.svg",
	"node_converter_all/signatures/614/1614174686180.svg",
	"node_converter_all/signatures/615/1614174772405.svg",
	"node_converter_all/signatures/616/1614174980890.svg",
	"node_converter_all/signatures/617/1619087008744.svg",
	"node_converter_all/signatures/618/1619087171947.svg",
	"node_converter_all/signatures/619/1619087301523.svg",
	"node_converter_all/signatures/620/1619087945622.svg",
	"node_converter_all/signatures/621/1619422828168.svg",
	"node_converter_all/signatures/622/1619425097197.svg",
	"node_converter_all/signatures/623/1619430349941.svg",
	"node_converter_all/signatures/701/1619969168583.svg",
	"node_converter_all/signatures/702/1620312668942.svg",
	"node_converter_all/signatures/703/1620313708966.svg"
], {
	output: {
		path: "./test-output/",
		name: "nestSvgFiles.test",
		svg: true
	},
	centralImage: fs.readFileSync("test-output/m.png"),
	coverImage: fs.readFileSync("test-output/c.png"),
	margin: 20/100
})
	.then(() => {
	})
	.catch(e => {
		console.log(e)
	})

module.exports = nestSvgFiles
