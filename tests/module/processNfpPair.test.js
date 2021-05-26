const { processNfpPair } = require("../../module/processNfpPair")
const { toMatchCloseTo } = require('jest-matcher-deep-close-to')
expect.extend({ toMatchCloseTo })

const data_0 = require("../data/module/processNfpPair/0")

describe.each([
	data_0
])("processNfpPair test", (input, options, expectedOutput, descr) => {

	it(descr, () => {
		const output = processNfpPair(input, options)
		//using 3 decimals
		expect(output).toMatchCloseTo(expectedOutput, 3)
	})

});

