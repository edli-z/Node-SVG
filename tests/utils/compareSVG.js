const { toMatchCloseTo } = require('jest-matcher-deep-close-to')
const svgPathParser = require("svg-path-parser")
const getPoints = require('../../module/utils/getPoints')

expect.extend({ toMatchCloseTo })

function _compareSVG(c, e){

	expect(c.type).toEqual(e.type)

	switch(c.type){
		case 'svg':
			break
		case 'ellipse':
			expect(parseFloat(c.attr("cx"))).toEqual(parseFloat(e.attr("cx")))
			expect(parseFloat(c.attr("cy"))).toEqual(parseFloat(e.attr("cy")))
			expect(parseFloat(c.attr("rx"))).toEqual(parseFloat(e.attr("rx")))
			expect(parseFloat(c.attr("ry"))).toEqual(parseFloat(e.attr("ry")))
			break
		case 'path':
			const cD = svgPathParser(c.attr("d"))
			const eD = svgPathParser(e.attr("d"))
			expect(cD).toMatchCloseTo(eD, 3)
			break
		case 'circle':
			expect(parseFloat(c.attr("cx"))).toEqual(parseFloat(e.attr("cx")))
			expect(parseFloat(c.attr("cy"))).toEqual(parseFloat(e.attr("cy")))
			expect(parseFloat(c.attr("r"))).toEqual(parseFloat(e.attr("r")))
			break
		case 'line':
			expect(parseFloat(c.attr("x1"))).toEqual(parseFloat(e.attr("x1")))
			expect(parseFloat(c.attr("y1"))).toEqual(parseFloat(e.attr("y1")))
			expect(parseFloat(c.attr("x2"))).toEqual(parseFloat(e.attr("x2")))
			expect(parseFloat(c.attr("y2"))).toEqual(parseFloat(e.attr("y2")))
			break
		case 'rect':
			expect(parseFloat(c.attr("x"))).toEqual(parseFloat(e.attr("x")))
			expect(parseFloat(c.attr("y"))).toEqual(parseFloat(e.attr("y")))
			expect(parseFloat(c.attr("width"))).toEqual(parseFloat(e.attr("width")))
			expect(parseFloat(c.attr("height"))).toEqual(parseFloat(e.attr("height")))
			break
		case 'polygon':
		case 'polyline':
			const cPoints = getPoints(c)
			const ePoints = getPoints(e)
			expect(cPoints).toMatchCloseTo(ePoints, 3)
			break
	}

	for(let i = 0; i < c.children().length; i++){
		const current = c.children()[i]
		const expected = e.children()[i]
		_compareSVG(current, expected)
	}

}

function compareSVG(c, e){
	_compareSVG(c, e)
	_compareSVG(e, c)
}

module.exports = compareSVG
