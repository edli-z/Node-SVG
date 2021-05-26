const splitPath = require("../../module/splitPath")

const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')

const compareSVG = require('../utils/compareSVG')

const window = createSVGWindow()
const document = window.document

const data_0 = require("../data/module/splitPath/0")

// register window and document
registerWindow(window, document)

describe.each([
	data_0
])('splitPath function', (input, expectedOutput, descr) => {

	it(descr, () => {

		var output = splitPath(SVG(input))

		for(let i = 0; i < expectedOutput.length; i++){
			var expectedSVG = SVG(expectedOutput[i])
			compareSVG(output[i], expectedSVG)
		}

	})

});

