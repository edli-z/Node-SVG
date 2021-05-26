const pathToAbsolute = require("../../module/pathToAbsolute")
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
const SvgPath = require('svgpath')

const window = createSVGWindow()
const document = window.document

const data_0 = require("../data/module/pathToAbsolute/0")
const data_1 = require("../data/module/pathToAbsolute/1")

// register window and document
registerWindow(window, document)

describe.each([
	data_0, data_1
])('pathToAbsolute function', (input, expectedOutput, descr) => {

	it(descr, () => {

		const output = pathToAbsolute(SVG(input))

		var expectedSVG = SVG(expectedOutput)

		var expectedPath = expectedSVG.attr('d')
		expectedPath = new SvgPath(expectedPath)
		expectedSVG.attr('d', expectedPath.abs().toString())

		expect(output.svg()).toEqual(expectedSVG.svg())

	})

});

