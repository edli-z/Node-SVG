const SAT = require('sat')
const PolyBool = require('polybooljs')
const polygonArea = require('2d-polygon-area')

function nextNfp(nfps, i, excluded){
	return nfps.findIndex((nfp,j) => 
		SAT.testPolygonPolygon(nfps[i], nfp) && !(i === j) && !excluded.includes(j)
	) 
}

function nfpToNode(nfps, i){
	let oo = []
	for(let j = 0; j < nfps.length; j++){
		let id = nextNfp(nfps, i, oo)
		if(id > -1){
			oo.push(id)
		}
	}
	return {
		i, oo
	}
}

function nfpsToNodes(nfps){
	let nodes = []
	for(let i = 0; i < nfps.length; i++){
		nodes.push(nfpToNode(nfps, i))
	}
	return nodes
}

function _merge(A, B){

	let t = new SAT.Vector(
		A.pos.x - B.pos.x,
		A.pos.y - B.pos.y
	)

	let bPts = B.calcPoints.map(b => [b.x - t.x, b.y - t.y])

	let aPts = A.calcPoints.map(a => [a.x, a.y])

	let uPts = PolyBool.union({
		regions: [aPts],
		inverted: false
	}, {
		regions: [bPts],
		inverted: false
	})

	let region = uPts.regions[0]

	if(uPts.regions.length > 1){
		let maxArea = 0
		for(let i = 0; i < uPts.regions.length; i++){
			const _region = uPts.regions[i]
			const area = Math.abs(polygonArea(_region))
			if(maxArea < area){
				maxArea = area
				region = _region
			}
		}
	}
	
	return new SAT.Polygon(
		A.pos.clone(),
		region.map(pt => new SAT.Vector(pt[0], pt[1]))
	)

}

function nfpUnion(nfps){
	let nodes = nfpsToNodes(nfps)
	let t = toUnionTerms(nodes)
	let M = nfps[t[0]]
	for(let i = 1; i < t.length; i++){
		M = _merge(M, nfps[t[i]])
	}
	return M
}

//from: i of the node <--> (node.i)
//to: i of the node <--> (node.i)
function findPath(from, to, nodes){
	let nodeFrom = nodes.find(n => n.i === from)
	let father = {}
	let hasBeenVisited = []
	for(let i = 0; i < nodeFrom.oo.length; i++){
		let n = nodes.find(n => n.i === nodeFrom.oo[i])
		if(!hasBeenVisited.includes(n.i)){
			father[n.i] = nodeFrom.i
			dfsFindPath(n, father, nodes, hasBeenVisited)
		}
	}

	let n = to
	let path = []

	while(!(n === from) && !(Object.keys(father).length === 0)){
		path.push(n)
		n = father[n]
	}

	return path.reverse()
}

function dfsFindPath(node, father, nodes, hasBeenVisited){
	hasBeenVisited.push(node.i)
	for(let i = 0; i < node.oo.length; i++){
		let n = nodes.find(n => n.i === node.oo[i])
		if(!hasBeenVisited.includes(n.i)){
			father[n.i] = node.i
			dfsFindPath(n, father, nodes, hasBeenVisited)
		}
	}
}

function flattenNode(node){
	return ([node.i]).concat(node.oo)
}

function flattenNodes(nodes){
	let fN = new Set(nodes.reduce((r, n) => r.concat(flattenNode(n)), []))
	fN = [...fN]
	return fN
}

function toUnionTerms(nodes){
	let flattNodes = flattenNodes(nodes)
	let uT = []
	for(let i = 0; i < flattNodes.length - 1; i++){
		let t0 = flattNodes[i]
		let t1 = flattNodes[i+1]
		var path = findPath(t0, t1, nodes)
		if(i === 0){
			uT.push(t0)
		}
		if(path){
			uT = [...uT, ...path]
		} else {
			//todo: raise an exception 
		}
	}
	return uT
}

module.exports = nfpUnion

//----------------------------------------------------------------------------------------

/*
var nodes = [
	{
		i: 0,
		oo: [3, 5, 1, 6]
	},
	{
		i: 1,
		oo: [0]
	},
	{
		i: 2,
		oo: [1, 9, 7]
	},
	{
		i: 3,
		oo: [2, 8]
	},
	{
		i: 4,
		oo: [5]
	},
	{
		i: 5,
		oo: [3, 4, 8]
	},
	{
		i: 6,
		oo: [0]
	},
	{
		i: 7,
		oo: [2]
	},
	{
		i: 8,
		oo: [3]
	},
	{
		i: 9,
		oo: [2]
	},
]

console.log("toUnionTerms", toUnionTerms(nodes))
*/
