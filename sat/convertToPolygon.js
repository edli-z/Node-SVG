const SAT = require('sat')
const _tM = require('transformation-matrix')

function convertToPolygon(svgPolygon){
	let m = _tM.fromString(svgPolygon.parent().attr('transform'))
	let o = _tM.applyToPoint(m, [0,0])

	let polygon = new SAT.Polygon(
		new SAT.Vector(o[0], o[1]),
		svgPolygon.array().map(pt => new SAT.Vector(pt[0], pt[1]))
	)

	return polygon
}

module.exports = convertToPolygon
