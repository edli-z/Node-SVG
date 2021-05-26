const convertToPolygon = require('./convertToPolygon')
const replaceImgWithCircle = require('./replaceImgWithCircle')
const replaceCircleWithPath = require('./replaceCircleWithPath')

//const fs = require("fs")

function convertSvgWithImg(svgStr){
	return convertToPolygon(replaceCircleWithPath(replaceImgWithCircle(svgStr)))
}

/*
const svgStr = fs.readFileSync(
	//"node_converter_all/signatures/701/1619969168583.svg", 
	"node_converter_all/signatures/610/1614155634258.svg",
	{ encoding: 'utf8' }
)
*/

//convertSvgWithImg(svgStr)

//console.log(convertSvgWithImg(svgStr))

module.exports = convertSvgWithImg
