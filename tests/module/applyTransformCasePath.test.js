const applyTransformCasePath = require("../../module/utils/applyTransformCasePath")
const svgPathParser = require("svg-path-parser")
const { toMatchCloseTo } = require('jest-matcher-deep-close-to')

expect.extend({ toMatchCloseTo })

const data_0 = require("../data/module/utils/applyTransformCasePath/0")
const data_1 = require("../data/module/utils/applyTransformCasePath/1")
const data_2 = require("../data/module/utils/applyTransformCasePath/2")
const data_3 = require("../data/module/utils/applyTransformCasePath/3")
const data_4 = require("../data/module/utils/applyTransformCasePath/4")

describe.each([
	data_0, data_1, data_2, data_3, data_4
])('applyTransformCasePath function', (pathData, matrix, expectedOutput, descr) => {

	it(descr, () => {
		const output = applyTransformCasePath(pathData, matrix)
		expect(svgPathParser(output)).toMatchCloseTo(svgPathParser(expectedOutput), 3)
	})

});

