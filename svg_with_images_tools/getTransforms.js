const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow, find } = require('@svgdotjs/svg.js')

function getTransforms(svgStr){
	var svg = SVG(svgStr)
	svg.findOne('rect').remove()
	svg.find('g.t').forEach(g => {
		var polygon = g.children()[0]
		g.attr("id", polygon.attr("id").replace("polygon_", "t_"))
		polygon.remove()
	})
	return svg.svg()
}

module.exports = getTransforms
