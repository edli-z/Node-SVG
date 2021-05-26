const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow, Matrix, G } = require('@svgdotjs/svg.js')
const _tM = require('transformation-matrix')
const uuid = require('uuid')

//const fs = require('fs')

function prepareSvgForInjection(svgStr){

	const window = createSVGWindow()
	const document = window.document
	registerWindow(window, document)

	const _ID = uuid.v4()

	let newSvgStr = svgStr.replace(/id\s*=\s*"([A-Za-z]+[\w\-\:\.]*)"/g, "id=\"$1-" + _ID + "\"")
	newSvgStr = newSvgStr.replace(/url\(((?:[A-Za-z]+[\w\-\:\.]*)*)#([A-Za-z]+[\w\-\:\.]*)\)/g, "url($1#$2-" + _ID + ")")

	const svg = SVG(newSvgStr)

	//---------------------------------------------------------------------
	var viewBox = svg.viewbox()
	
	var m0 = _tM.compose(
		_tM.scale(100, 100),
		_tM.translate(-viewBox.x, -viewBox.y)
	)

	viewBox = viewBox.transform(new Matrix(
		_tM.toString(m0)
			.replace("matrix(", "").replace(")", "")
	))

	svg.viewbox(viewBox)
	//---------------------------------------------------------------------

	let g = new G()

	svg.children().forEach((child) => {
		child.addTo(g)
	})

	g.addTo(svg)

	g.attr('transform', _tM.toString(m0))

	return svg.svg()
}

/*
const svgStr = fs.readFileSync(
	//"node_converter_all/signatures/616/1614174980890.svg", 
	//"prepareSvgForInjection-0.test.svg",
	"prepareSvgForInjection-3.test.svg",
	{ encoding: 'utf8' }
)

console.log(prepareSvgForInjection(svgStr))
//prepareSvgForInjection(svgStr)
*/

module.exports = prepareSvgForInjection
