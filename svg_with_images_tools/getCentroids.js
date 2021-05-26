const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow, find } = require('@svgdotjs/svg.js')
const SAT = require('sat')

function getCentroids(svgStr){
	var svg = SVG(svgStr)
	var centroids = svg.find('g.t').map(g => {
		var polygon = g.children()[0]
		var points = polygon.array()
		var p = new SAT.Polygon(
			new SAT.Vector(),
			points.map(pt => new SAT.Vector(pt[0], pt[1]))
		)
		const centroid = p.getCentroid()
		return {
			id: parseInt(polygon.attr("id").replace("polygon_", "")),
			centroid
		}
	})
	return centroids
}

module.exports = getCentroids
