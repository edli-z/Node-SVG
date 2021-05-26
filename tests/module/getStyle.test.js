const getStyle = require("../../module/getStyle")
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
const compareSVG = require('../utils/compareSVG.js')

const window = createSVGWindow()
const document = window.document

const data_0 = require("../data/module/getStyle/0")

// register window and document
registerWindow(window, document)

describe.each([
	data_0
])('getStyle function', (input, expectedOutput, descr) => {

	it(descr, () => {

		const output = getStyle(SVG(input))

		expect(output).toEqual(SVG(expectedOutput))

	})

});

