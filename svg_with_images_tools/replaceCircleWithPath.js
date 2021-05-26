const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow, find, Circle, ClipPath, Path } = require('@svgdotjs/svg.js')
const { encodeSVGPath, SVGPathData } = require("svg-pathdata")
const SvgPath = require('svgpath')

//const fs = require("fs")

function replaceCircleWithPath(svgStr){

	const window = createSVGWindow()
	const document = window.document
	 
	// register window and document
	registerWindow(window, document)
	 
	// create canvas
	const canvas = SVG(svgStr)

	canvas.find('circle').filter((c) => !(c.parent() instanceof ClipPath)).forEach(function(circle){

		const cx = parseFloat(circle.attr('cx'))
		const cy = parseFloat(circle.attr('cy'))
		const r = parseFloat(circle.attr('r'))
		const transform = circle.attr('transform')

		const stroke = circle.attr('stroke')
		const strokeWidth = circle.attr('stroke-width')
		const fill = circle.attr('fill')

		const path = new Path()

		path.attr("stroke", stroke)
		path.attr("stroke-width", strokeWidth)
		path.attr("fill", fill)
		//path.attr("transform", transform)

		const d = encodeSVGPath([
			{ 
				type: SVGPathData.MOVE_TO, 
				relative: false, 
				x: cx - r, 
				y: cy
			},
			{ 
				type: SVGPathData.ARC, 
				relative: true,  
				rX: r,
				rY: r,
				xRot: 0,	
				lArcFlag: 1,
				sweepFlag: 1,
				x: r * 2, 
				y: 0
			},
			{ 
				type: SVGPathData.ARC, 
				relative: true,  
				rX: r,
				rY: r,
				xRot: 0,	
				lArcFlag: 1,
				sweepFlag: 1,
				x: -(r * 2), 
				y: 0
			},
			//{ type: SVGPathData.CLOSE_PATH }
		])

		path.attr('d', d)

		const pathData = new SvgPath(path.attr('d'))

		pathData.transform(transform)

		path.attr('d', pathData.toString())

		circle.replace(path)
		
	})

	return canvas.svg()
}

/*
const svgStr = fs.readFileSync(
	"test.svg", 
	{ encoding: 'utf8' }
)

console.log(replaceCircleWithPath(svgStr))
*/

module.exports = replaceCircleWithPath
