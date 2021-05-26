const recurse = require("../../module/recurse")
const splitPath = require("../../module/splitPath")

const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')

const compareSVG = require('../utils/compareSVG')

const window = createSVGWindow()
const document = window.document

const data_0 = require("../data/module/recurse/0")

// register window and document
registerWindow(window, document)

describe.each([
	data_0
])('recurse with splitPath as func', (input, expectedOutput, descr) => {

	it(descr, () => {

		var svgInput = SVG(input)

		var output = recurse(svgInput, splitPath)
		var expectedSVG = SVG(expectedOutput)

		compareSVG(output, expectedSVG)

	})

});

