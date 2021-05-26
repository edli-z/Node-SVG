const cleanInput = require("../../module/cleanInput")
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
const compareSVG = require("../utils/compareSVG")

const window = createSVGWindow()
const document = window.document

// register window and document
registerWindow(window, document)

const data_0 = require("../data/module/cleanInput/0")

describe.each([
	data_0
])('cleanInput function', (input, allowedElements, expectedOutput, descr) => {
	it(descr, () => {

		var output = cleanInput(SVG(input), allowedElements)
		const expectedSVG = SVG(expectedOutput)

		compareSVG(output, expectedSVG)

	})
})


