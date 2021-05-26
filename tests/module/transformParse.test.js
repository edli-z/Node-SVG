const transformParse = require("../../module/transformParse")
const data_0 = require("../data/module/transformParse/0")
const data_1 = require("../data/module/transformParse/1")

describe.each([
	data_0, data_1
])('transformParse function', (input, expectedOutput, descr) => {

	it(descr, () => {
		const output = transformParse(input)
		expect(JSON.parse(JSON.stringify(output))).toEqual(expectedOutput)
	})

});

