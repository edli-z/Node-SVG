
const filter = require("../../module/filter")
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
const compareSVG = require('../utils/compareSVG.js')

const window = createSVGWindow()
const document = window.document

const data_0 = require("../data/module/filter/0")

// register window and document
registerWindow(window, document)

describe.each([
	data_0
])('filter function', (allowedElements, input, expectedOutput, descr) => {

	it(descr, () => {

		const output = filter(allowedElements, SVG(input))

		compareSVG(output, SVG(expectedOutput))

	})

});

