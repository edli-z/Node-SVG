const imageDataURI = require('image-data-uri')
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow, Box, Image } = require('@svgdotjs/svg.js')

async function constructCover(buffer){
	const window = createSVGWindow()
	const document = window.document
	registerWindow(window, document)

	const dataURI = await imageDataURI.encode(buffer, "PNG")

	const svg = SVG('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' + 
		'width="11in" height="8.5in" viewBox="0 0 1100 850"></svg>')

	const image = new Image()

	let W = 550
	let H = 850

	let x = 550
	let y = 0

	let M = 5/100

	x+=W*(M/2)
	y+=H*(M/2)

	W-=W*M
	H-=H*M

	image.attr("xlink:href", dataURI)
	image.attr("x", x)
	image.attr("y", y)
	image.attr("width", W)
	image.attr("height", H)

	image.addTo(svg)

	return svg.svg()
}

module.exports = constructCover
