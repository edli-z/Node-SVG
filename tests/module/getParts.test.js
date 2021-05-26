const getParts = require("../../module/getParts")
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
const { toMatchCloseTo } = require('jest-matcher-deep-close-to')

expect.extend({ toMatchCloseTo })

const window = createSVGWindow()
const document = window.document

const data_0 = require("../data/module/getParts/0")

// register window and document
registerWindow(window, document)

describe.each([
	data_0
])('getParts function', (input, curveTolerance, toleranceSvg, clipperScale, expectedOutput, descr) => {

	it(descr, () => {

		svgInput = []

		for(let i = 0; i < input.length; i++){
			svgInput.push(SVG(input[i]))
		}

		var output = getParts(svgInput, curveTolerance, toleranceSvg, clipperScale)
		
		expect(output).toMatchCloseTo(expectedOutput, 3)

	})

});

