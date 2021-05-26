const svgToClipper = require("../../module/svgToClipper")
const { toMatchCloseTo } = require('jest-matcher-deep-close-to')
expect.extend({ toMatchCloseTo })


test('svgToClipper test', () => {
	const clipperScale = 10000000

	const polygon = [
		{
			"x": 90,
			"y": 9.6
		},
		{
			"x": 100,
			"y": 9.6
		},
		{
			"x": 100,
			"y": 27
		},
		{
			"x": 100,
			"y": 89
		},
		{
			"x": 23,
			"y": 89
		},
		{
			"x": 23,
			"y": 99
		},
		{
			"x": 33,
			"y": 99
		},
		{
			"x": 33.224609375,
			"y": 80.6875
		},
		{
			"x": 33.859375,
			"y": 67.25
		},
		{
			"x": 36.125,
			"y": 52
		},
		{
			"x": 39.328125,
			"y": 47.25
		},
		{
			"x": 43,
			"y": 47
		},
		{
			"x": 46.125,
			"y": 53.875
		},
		{
			"x": 53,
			"y": 57
		},
		{
			"x": 59.875,
			"y": 62
		},
		{
			"x": 63,
			"y": 67
		},
		{
			"x": 60.5,
			"y": 72
		},
		{
			"x": 63,
			"y": 75.4375
		},
		{
			"x": 73,
			"y": 77
		},
		{
			"x": 64.375,
			"y": 65.625
		},
		{
			"x": 61.5,
			"y": 58.5
		},
		{
			"x": 64.375,
			"y": 55.625
		},
		{
			"x": 73,
			"y": 57
		},
		{
			"x": 80.5,
			"y": 54.5
		},
		{
			"x": 83,
			"y": 52
		},
		{
			"x": 80.5,
			"y": 49.5
		},
		{
			"x": 73,
			"y": 47
		},
		{
			"x": 65.3125,
			"y": 44.6875
		},
		{
			"x": 62.25,
			"y": 42.75
		},
		{
			"x": 63.8125,
			"y": 41.1875
		},
		{
			"x": 70,
			"y": 40
		},
		{
			"x": 76.375,
			"y": 38.3125
		},
		{
			"x": 78.5,
			"y": 35.25
		},
		{
			"x": 76.375,
			"y": 30.8125
		},
		{
			"x": 70,
			"y": 25
		},
		{
			"x": 67.37436867076458,
			"y": 13.661165235168157
		},
		{
			"x": 57.500000000000014,
			"y": 7.5000000000000036
		},
		{
			"x": 46.16116523516816,
			"y": 10.125631329235416
		},
		{
			"x": 40,
			"y": 20
		},
		{
			"x": 35.00000002592648,
			"y": 22.07106774443052
		},
		{
			"x": 30.000000070346,
			"y": 19.99999993547608
		},
		{
			"x": 27.928932255569485,
			"y": 14.999999982307173
		},
		{
			"x": 30,
			"y": 10
		}
	]

	const expectedOutput = [
		{
			"X": 900000000,
			"Y": 96000000
		},
		{
			"X": 1000000000,
			"Y": 96000000
		},
		{
			"X": 1000000000,
			"Y": 270000000
		},
		{
			"X": 1000000000,
			"Y": 890000000
		},
		{
			"X": 230000000,
			"Y": 890000000
		},
		{
			"X": 230000000,
			"Y": 990000000
		},
		{
			"X": 330000000,
			"Y": 990000000
		},
		{
			"X": 332246094,
			"Y": 806875000
		},
		{
			"X": 338593750,
			"Y": 672500000
		},
		{
			"X": 361250000,
			"Y": 520000000
		},
		{
			"X": 393281250,
			"Y": 472500000
		},
		{
			"X": 430000000,
			"Y": 470000000
		},
		{
			"X": 461250000,
			"Y": 538750000
		},
		{
			"X": 530000000,
			"Y": 570000000
		},
		{
			"X": 598750000,
			"Y": 620000000
		},
		{
			"X": 630000000,
			"Y": 670000000
		},
		{
			"X": 605000000,
			"Y": 720000000
		},
		{
			"X": 630000000,
			"Y": 754375000
		},
		{
			"X": 730000000,
			"Y": 770000000
		},
		{
			"X": 643750000,
			"Y": 656250000
		},
		{
			"X": 615000000,
			"Y": 585000000
		},
		{
			"X": 643750000,
			"Y": 556250000
		},
		{
			"X": 730000000,
			"Y": 570000000
		},
		{
			"X": 805000000,
			"Y": 545000000
		},
		{
			"X": 830000000,
			"Y": 520000000
		},
		{
			"X": 805000000,
			"Y": 495000000
		},
		{
			"X": 730000000,
			"Y": 470000000
		},
		{
			"X": 653125000,
			"Y": 446875000
		},
		{
			"X": 622500000,
			"Y": 427500000
		},
		{
			"X": 638125000,
			"Y": 411875000
		},
		{
			"X": 700000000,
			"Y": 400000000
		},
		{
			"X": 763750000,
			"Y": 383125000
		},
		{
			"X": 785000000,
			"Y": 352500000
		},
		{
			"X": 763750000,
			"Y": 308125000
		},
		{
			"X": 700000000,
			"Y": 250000000
		},
		{
			"X": 673743687,
			"Y": 136611652
		},
		{
			"X": 575000000,
			"Y": 75000000
		},
		{
			"X": 461611652,
			"Y": 101256313
		},
		{
			"X": 400000000,
			"Y": 200000000
		},
		{
			"X": 350000000,
			"Y": 220710677
		},
		{
			"X": 300000001,
			"Y": 199999999
		},
		{
			"X": 279289323,
			"Y": 150000000
		},
		{
			"X": 300000000,
			"Y": 100000000
		}
	]

	const output = svgToClipper(polygon, clipperScale)
	expect(output).toMatchCloseTo(expectedOutput, 3)
});



