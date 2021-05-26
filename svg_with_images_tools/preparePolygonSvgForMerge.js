//const { createSVGWindow } = require('svgdom')
const { SVG, /*registerWindow,*/ Matrix } = require('@svgdotjs/svg.js')
const _tM = require('transformation-matrix')

//const fs = require('fs')

function preparePolygonSvgForMerge(svgStr){

	//-----------------------------------------------
	/*
	const window = createSVGWindow()
	const document = window.document
	registerWindow(window, document)
	*/
	//----------------------------------------------

	const svg = SVG(svgStr)
	const polygon = svg.findOne('polygon')

	var viewBox = svg.viewbox()
	
	var m0 = _tM.translate(
		-viewBox.x, -viewBox.y
	)

	viewBox = viewBox.transform(new Matrix(
		_tM.toString(m0)
			.replace("matrix(", "").replace(")", "")
	))

	svg.viewbox(viewBox)

	var polygonPts = polygon.array()

	var newPolygonPts = polygonPts.map(pt => {
		return _tM.applyToPoint(m0, pt)
	})

	polygon.plot(newPolygonPts)

	return svg.svg()
}

/*
const svgStr = fs.readFileSync(
	//"node_converter_all/signatures/616/1614174980890.svg", 
	"convertToPolygon-0.test.svg",
	{ encoding: 'utf8' }
)

console.log(preparePolygonSvgForMerge(svgStr))
//preparePolygonSvgForMerge(svgStr)
*/

module.exports = preparePolygonSvgForMerge
