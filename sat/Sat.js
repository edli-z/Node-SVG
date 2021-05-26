const { SVG, Rect, Polygon, G, Box } = require('@svgdotjs/svg.js')
const convertToPolygon = require('./convertToPolygon')
const { placeAroundACircle, _merge } = require('./placeAroundACircle')
const degrees = require('radians-degrees')
const SAT = require('sat')
//const noFitPolygon = require('./noFitPolygon')
const boundingBox = require('./boundingBox')

class Sat {

	constructor(svgStr){

		this.svgStr = svgStr

		let svg = SVG(this.svgStr)

		let parts = svg.find('polygon')

		this.polygons = parts.map(part => { 
			return { 
				polygon: convertToPolygon(part), 
				sourceId: part.attr("id")
			}
		})

		//-------------------------------------------------------


		this.outputSvg = SVG()


		let rect = new Rect('<rect x="0" y="0" class="fullRect"></rect>')
		rect.addTo(this.outputSvg)

	}

	renderPolygon({ polygon, sourceId }){

			let g = new G()
			g.attr('class', 't')
			g.attr('transform', 'translate(' + polygon.pos.x + ', ' + polygon.pos.y + ') rotate(' + degrees(polygon.angle) + ')')
			g.addTo(this.outputSvg)
			let pts = polygon.points.map(v => [v.x, v.y])
			let poly = new Polygon()
			poly.attr("id", sourceId)
			poly.plot(pts)
			poly.addTo(g)
	}

	renderSATPolygon(polygon){
			let g = new G()
			g.attr('transform', 'translate(' + polygon.pos.x + ', ' + polygon.pos.y + ') rotate(' + degrees(polygon.angle) + ')')
			g.addTo(this.outputSvg)
			g.attr('fill', 'none')
			g.attr('stroke', 'red')
			let pts = polygon.points.map(v => [v.x, v.y])
			let poly = new Polygon()
			poly.plot(pts)
			poly.addTo(g)
	}

	render(){
		let bb = boundingBox(this.polygons)

		let W, H

		if(Math.abs(bb.pos.y) > Math.abs(bb.pos.y + bb.h)){
			H = Math.abs(bb.pos.y * 2)
		} else {
			H = Math.abs((bb.pos.y + bb.h) * 2)
		}

		if(Math.abs(bb.pos.x) > Math.abs(bb.pos.x + bb.w)){
			W = Math.abs(bb.pos.x * 2)
		} else {
			W = Math.abs((bb.pos.x + bb.w) * 2)
		}

		let M=5/100
		W=W+(W*M)
		H=H+(H*M)

		let h = W * (850/1100)

		let w = H * (1100/850)

		if(h >= H){
			H = h
		} else if(w >= W){
			W = w
		}

		let outputViewBox = new Box()
		outputViewBox.x = -W/2
		outputViewBox.y = -H/2
		outputViewBox.width = W
		outputViewBox.height = H

		this.outputSvg.viewbox(outputViewBox)
		this.outputSvg.attr('width', '11in')
		this.outputSvg.attr('height', '8.5in')

		this.polygons.forEach((polygon) => {
			this.renderPolygon(polygon)
		})

	}


	start(){
		return new Promise((resolve, reject) => {

			placeAroundACircle(this.polygons)

			this.render()

			resolve(this.outputSvg.svg())

		})
	}

}

module.exports = Sat
