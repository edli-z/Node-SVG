const { minkowskiDifference } = require('../module/processNfpPair')
const SAT = require('sat')

//B is movable
function noFitPolygon(A, B){

	let t = new SAT.Vector(
		B.pos.x - A.pos.x,
		B.pos.y - A.pos.y
	)

	let b = new SAT.Polygon(
		new SAT.Vector(A.pos.x, A.pos.y),
		B.calcPoints.map(function(v){
		return new SAT.Vector(v.x + t.x, v.y + t.y) 
	}))

	let nfp = minkowskiDifference(A.calcPoints, b.calcPoints)[0]

	nfp = new SAT.Polygon(
		new SAT.Vector(A.pos.x, A.pos.y),
		nfp.map(({x, y}) => new SAT.Vector(x,y))
	)

	return nfp
}

module.exports = noFitPolygon
