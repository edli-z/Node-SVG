const fs = require('fs')
const containsImage = require('./containsImage')
const convertSvgWithImg = require('./convertSvgWithImg')
const convertToPolygon = require('./convertToPolygon')
const mergePolygons = require('./mergePolygons')
const convertCentralImage = require('./convertCentralImage')

async function mergeSvgFiles(fileNameArray, centralImage){
	
	var svgStrArray = fileNameArray.map(fileName => {
		return fs.readFileSync(
			fileName, 
			{ encoding: 'utf8' }
		)
	})

	svgStrArray = svgStrArray.map(svgStr => {
		if(containsImage(svgStr)){
			return convertSvgWithImg(svgStr)
		}
		return convertToPolygon(svgStr)
	})

	let centralImageSvgStr

	if(centralImage){
		let centralImageSvgStr = await convertCentralImage(centralImage)
		svgStrArray.push(centralImageSvgStr)
	}

	return mergePolygons(svgStrArray)
}

/*
console.log(mergeSvgFiles([
	"node_converter_all/signatures/615/1614174772405.svg",
	"node_converter_all/signatures/616/1614174980890.svg",
	"node_converter_all/signatures/701/1619969168583.svg"
]))
*/

module.exports = mergeSvgFiles
