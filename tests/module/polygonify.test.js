const polygonify = require("../../module/polygonify")
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
const fs = require('fs')
const { toMatchCloseTo } = require('jest-matcher-deep-close-to')

expect.extend({ toMatchCloseTo })

const window = createSVGWindow()
const document = window.document

// register window and document
registerWindow(window, document)

describe.each([
	['media/polygon.svg', 'media/polygonify-output/polygon.json', 'polygon'],
	['media/circle.svg', 'media/polygonify-output/circle.json', 'circle'],
	['media/path.svg', 'media/polygonify-output/path.json', 'path'],
	['media/path-with-VHLC.svg', 'media/polygonify-output/path-with-VHLC.json', 'path', 'path-with-VHLC'],
	['media/path-with-S.svg', 'media/polygonify-output/path-with-S.json', 'path', 'path-with-S'],
	['media/path-with-QT.svg', 'media/polygonify-output/path-with-QT.json', 'path', 'path-with-QT'],
	['media/path-with-A.svg', 'media/polygonify-output/path-with-A.json', 'path', 'path-with-A'],
	['media/path-with-all.svg', 'media/polygonify-output/path-with-all.json', 'path', 'path-with-all'],
	['media/ellipse.svg', 'media/polygonify-output/ellipse.json', 'ellipse'],
	['media/rect.svg', 'media/polygonify-output/rect.json', 'rect'],
])("polygonify test", (svgPath, polygonifyOutputPath, inputType, additionalInfo) => {


	it(inputType + " as input" + ( additionalInfo ? ( ", " + additionalInfo ) : '' ) , () => {

		const svgStr = fs.readFileSync(
			svgPath, 
			{ encoding: 'utf8' }
		)

		let polygonifyOutput = fs.readFileSync(
			polygonifyOutputPath, 
			{ encoding: 'utf8' }
		)

		polygonifyOutput = JSON.parse(polygonifyOutput)

		const tolerance = 2
		const toleranceSvg = 0.005

		const arrayOfPoints = polygonify(SVG(svgStr), tolerance, toleranceSvg)

		//using 3 decimals
		expect(arrayOfPoints).toMatchCloseTo(polygonifyOutput, 3)

	})

});

const data_0 = require("../data/module/polygonify/0")

describe.each([
	data_0
])("polygonify test with data", (svgStr, tolerance, toleranceSvg, polygonifyOutput, descr) => {

	it(descr, () => {

		const arrayOfPoints = polygonify(SVG(svgStr), tolerance, toleranceSvg)

		//using 3 decimals
		expect(arrayOfPoints).toMatchCloseTo(polygonifyOutput, 3)

	})

});

