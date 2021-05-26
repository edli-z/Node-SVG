const applyTransform = require("../../module/applyTransform")
const fs = require('fs')
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
const getPoints = require('../../module/utils/getPoints')
const { toMatchCloseTo } = require('jest-matcher-deep-close-to')
const svgPathParser = require("svg-path-parser")
const compareSVG = require("../utils/compareSVG")

expect.extend({ toMatchCloseTo })

const window = createSVGWindow()
const document = window.document

// register window and document
registerWindow(window, document)

describe.each([
	["media/polygon.svg", "polygon"],
	["media/all.svg", "all"]
])('applyTransform function', (svgPath, descr) => {

	it(descr, () => {

		const svgStr = fs.readFileSync(
			svgPath, 
			{ encoding: 'utf8' }
		)

		applyTransform(SVG(svgStr))

	})

});

const data_0 = require("../data/module/applyTransform/0")
const data_1 = require("../data/module/applyTransform/1")
const data_2 = require("../data/module/applyTransform/2")
const data_3 = require("../data/module/applyTransform/3")
const data_4 = require("../data/module/applyTransform/4")

describe.each([
	data_0, data_1, data_2, data_3, data_4
])('applyTransform function tests with data', (before, expected, descr) => {
	it(descr, () => {

		var svgRoot = SVG(before)
		svgRoot = applyTransform(svgRoot)
		const expectedSVG = SVG(expected)

		compareSVG(svgRoot, expectedSVG)

	})
})


