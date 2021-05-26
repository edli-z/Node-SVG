const SAT = require('sat')
const noFitPolygon = require('./noFitPolygon')
const PolyBool = require('polybooljs')
const radians = require('degrees-radians')
const nfpUnion = require('./nfpUnion')

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min +1)) + min
}

function getRandomAngle(){
	angles = [
		-Math.PI/3,
		-Math.PI/4,
		-Math.PI/6,
		-Math.PI/12,
		0,
		Math.PI/12,
		Math.PI/6,
		Math.PI/4,
		Math.PI/3
	]
	let i = getRandomInt(0, angles.length - 1)
	return angles[i]
}

function place(polygons, index){

	let thePlaced = polygons.slice(0, index).map(p => p.polygon)
	let toPlace = polygons[index].polygon
	let nfp = false

	let angle = getRandomAngle()
	toPlace.setAngle(angle)

	if(thePlaced.length < 2){
		nfp = noFitPolygon(polygons[0].polygon, toPlace)
	} else {
		let nfps = []
		for(let i = 0; i < thePlaced.length; i++){
			let placed = thePlaced[i]
			nfps.push(noFitPolygon(placed, toPlace))
		}
		nfp = nfpUnion(nfps)
	}

	const _place = (B, i, nfp) => {
		let b0 = B.calcPoints[0]
		b0 = new SAT.Vector(b0.x + B.pos.x, b0.y + B.pos.y)
		let nfPt = nfp.calcPoints[i]
		nfPt = new SAT.Vector(nfPt.x + nfp.pos.x, nfPt.y + nfp.pos.y)
		let t = new SAT.Vector(
			nfPt.x - b0.x,
			nfPt.y - b0.y
		)
		B.pos.add(t)
	}

	let fPP = polygons[0].polygon

	let c0 = fPP.getCentroid()
	c0.add(fPP.pos)

	let iMin = 0
	let dMin = undefined

	for(let i = 0, c = nfp.calcPoints.length; i < c; i++){
		_place(toPlace, i, nfp)
		let c1 = toPlace.getCentroid()
		c1.add(toPlace.pos)
		let d = c0.clone()
		d.sub(c1)
		let dist = d.len()
		if(dMin === undefined || dist < dMin){
			dMin = dist
			iMin = i
		}
	}

	_place(toPlace, iMin, nfp)
}

function placeAroundACircle(polygons){

	polygons.unshift(polygons.pop())

	let circle = polygons[0].polygon

	let centroid = circle.getCentroid()

	circle.pos = new SAT.Vector(-centroid.x, -centroid.y)

	for(let i = 1; i < polygons.length; i++){
		place(polygons, i)
	}

}

exports.placeAroundACircle = placeAroundACircle
