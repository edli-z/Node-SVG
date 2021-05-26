const flatten = require("../../module/flatten")
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
const compareSVG = require('../utils/compareSVG.js')

const window = createSVGWindow()
const document = window.document

const data_0 = require("../data/module/flatten/0")
const data_1 = require("../data/module/flatten/1")

// register window and document
registerWindow(window, document)

describe.each([
	data_0, data_1
])('flatten function', (input, expectedOutput, descr) => {

	it(descr, () => {

		const output = flatten(SVG(input))

		compareSVG(output, SVG(expectedOutput))

	})

});

