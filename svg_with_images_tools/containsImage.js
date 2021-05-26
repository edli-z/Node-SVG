const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')

//const fs = require("fs")

function containsImage(svgStr){
	const window = createSVGWindow()
	const document = window.document
	 
	// register window and document
	registerWindow(window, document)
	 
	// create canvas
	const canvas = SVG(svgStr)

	return canvas.find('image').length > 0
}

/*
const svgStr = fs.readFileSync(
	//"node_converter_all/signatures/701/1619969168583.svg", 
	"node_converter_all/signatures/616/1614174980890.svg",
	{ encoding: 'utf8' }
)
*/

//containsImage(svgStr)

//console.log(containsImage(svgStr))

module.exports = containsImage
