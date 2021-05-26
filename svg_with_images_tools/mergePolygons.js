const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow, Box, Matrix, G } = require('@svgdotjs/svg.js')
const transformationMatrix = require('transformation-matrix')
const random = require('random')
const preparePolygonSvgForMerge = require('./preparePolygonSvgForMerge')

//const fs = require("fs")

function mergePolygons(svgStrArray){

	const window = createSVGWindow()
	const document = window.document
	 
	// register window and document
	registerWindow(window, document)
	 
	// create canvas
	const canvas = SVG(document.documentElement)


	var canvasViewBox = new Box()

	var maxWidth = Math.max(...svgStrArray.map(svgStr => SVG(svgStr).viewbox().width))
	var maxHeight = Math.max(...svgStrArray.map(svgStr => SVG(svgStr).viewbox().height))

	let sections = Math.ceil(Math.sqrt(svgStrArray.length));
	canvasViewBox.width = Math.ceil(sections * maxWidth);
	canvasViewBox.height = Math.ceil(sections * maxHeight);
	canvasViewBox.x = 0;
	canvasViewBox.y = 0;
	canvas.viewbox(canvasViewBox)

	canvas.attr("width",canvasViewBox.width)
	canvas.attr("height",canvasViewBox.height)

	let position_shift_x = 0;
	let position_shift_y = 0;

	svgStrArray.forEach((svgStr, index) => {

		const svg = SVG(preparePolygonSvgForMerge(svgStr))

		let g = new G()
		g.addTo(canvas)

		const polygon = svg.findOne('polygon')
		polygon.addTo(g)
		polygon.attr("id", "polygon_" + index)

		var m1 = new Matrix()
		m1 = m1.translate(position_shift_x * maxWidth, position_shift_y * maxHeight)

		g.attr('transform', m1.toString())

		if(position_shift_x < (sections - 1)){
			position_shift_x++;
		} else {
			position_shift_x = 0;
			position_shift_y++;
		}

	})


	return canvas.svg()
}

/*
const svgStr0 = fs.readFileSync(
	"convertToPolygon-0.test.svg", 
	{ encoding: 'utf8' }
)

const svgStr1 = fs.readFileSync(
	"convertToPolygon-0.test.svg", 
	{ encoding: 'utf8' }
)

const svgStr2 = fs.readFileSync(
	"convertToPolygon-0.test.svg", 
	{ encoding: 'utf8' }
)

//mergePolygons([svgStr, svgStr])
console.log(mergePolygons([
	svgStr0, svgStr1, svgStr2, svgStr0,
	svgStr1, svgStr2, svgStr0, svgStr1
]))
*/

module.exports = mergePolygons
