const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow, Matrix } = require('@svgdotjs/svg.js')
const cleanInput = require("../module/cleanInput")
//const cleanPolygon = require("../module/cleanPolygon")
const { svgPathProperties } = require("svg-path-properties");
const concaveman = require("concaveman");
const transformationMatrix = require('transformation-matrix')
const SvgPath = require('svgpath')

//const fs = require('fs')

function convertToPolygon(svgStr){
	const window = createSVGWindow()
	const document = window.document
	 
	// register window and document
	registerWindow(window, document)

	var svg = SVG(svgStr)

	svg.find("defs").forEach(defs => defs.remove())

	svg = cleanInput(
		svg, [
			"svg", "circle", "ellipse", "path",
			"polygon", "polyline", "rect", "line"
		]
	)

	var m0 = transformationMatrix.scale(100, 100)
	var viewBox = svg.viewbox()

	viewBox = viewBox.transform(new Matrix(
		transformationMatrix.toString(m0)
			.replace("matrix(", "").replace(")", "")
	))


	svg.viewbox(viewBox)

	svg.children().forEach(child => {

		let d = child.attr('d')

		const pathData = new SvgPath(d)
		pathData.transform(transformationMatrix.toSVG(m0))
		child.attr('d', pathData.toString())

	})

	const arrayOfPoints = []

	svg.children().forEach(child => {

		let d = child.attr('d')

		let pathLength = new svgPathProperties(d).getTotalLength();
		let numPoints = pathLength / 10;

		if(pathLength < 10) {
			numPoints = 2;
		}

		for (let j=0; j<numPoints; j++) {
			let p = new svgPathProperties(d).getPointAtLength((j / numPoints) * pathLength );
			arrayOfPoints.push(p)
		}

	})

	const pointsForHull = arrayOfPoints.map(({ x, y }) => [ x, y ])

	var hull_pts = concaveman(pointsForHull, Number.POSITIVE_INFINITY)

	/*
	const clipperScale = 10000000
	const curveTolerance = 0.3

	hull_pts = hull_pts.map(pt => ({ x: pt[0], y: pt[1] })), 

	hull_pts = cleanPolygon(
		hull_pts,
		clipperScale, curveTolerance
	)

	hull_pts = hull_pts.map(({ x, y }) => [x, y]), 
	*/

	svg.clear().polygon(hull_pts)

	return svg.svg()
}

/*
const svgStr = fs.readFileSync(
	//"node_converter_all/signatures/616/1614174980890.svg", 
	"node_converter_all/signatures/615/1614174772405.svg",
	{ encoding: 'utf8' }
)

console.log(convertToPolygon(svgStr))
//convertToPolygon(svgStr)
*/

module.exports = convertToPolygon
