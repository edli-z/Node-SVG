const concaveman = require("concaveman");
const SAT = require('sat')

function boundingBox(polygons){
	var pts = polygons.reduce(function(acc, {polygon}){
		let points = polygon.calcPoints.map(function(point){
			return [
				point.x + polygon.pos.x,
				point.y + polygon.pos.y
			]
		})
		return acc.concat(points)
	}, [])
	pts = concaveman(pts, Number.POSITIVE_INFINITY)
	return (new SAT.Polygon(
		new SAT.Vector(0, 0),
		pts.map(pt => new SAT.Vector(pt[0], pt[1]))
	)).getAABBAsBox()
}

module.exports = boundingBox
