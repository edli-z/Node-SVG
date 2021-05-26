const { SVGPathData } = require('svg-pathdata')

function MLHVCSQTA_test(svgPathDataCommand){
	return ( svgPathDataCommand.relative === false ) && (
		svgPathDataCommand.type === SVGPathData.MOVE_TO || 
		svgPathDataCommand.type === SVGPathData.LINE_TO || 
		svgPathDataCommand.type === SVGPathData.HORIZ_LINE_TO || 
		svgPathDataCommand.type === SVGPathData.VERT_LINE_TO || 
		svgPathDataCommand.type === SVGPathData.CURVE_TO || 
		svgPathDataCommand.type === SVGPathData.SMOOTH_CURVE_TO || 
		svgPathDataCommand.type === SVGPathData.QUAD_TO || 
		svgPathDataCommand.type === SVGPathData.SMOOTH_QUAD_TO || 
		svgPathDataCommand.type === SVGPathData.ARC
	)
}

module.exports = MLHVCSQTA_test
