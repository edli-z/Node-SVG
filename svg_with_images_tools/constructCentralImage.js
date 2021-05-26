const imageDataURI = require('image-data-uri')
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow, Box } = require('@svgdotjs/svg.js')

async function constructCentralImage(buffer){
	const window = createSVGWindow()
	const document = window.document
	registerWindow(window, document)

	const dataURI = await imageDataURI.encode(buffer, "PNG")

	const svg = SVG('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' + 
		'width="800" height="800" viewBox="0 0 2 2">' + 
		'<defs><clipPath id="circle" clipPathUnits="objectBoundingBox"><circle cx=".5" cy=".5" r=".5"/></clipPath></defs>' + 
		'<image xlink:href="' + dataURI + '" x="0.01" y="0.01" width="1.98" height="1.98" clip-path="url(#circle)" transform="translate(0 0) rotate(0)"/>' + '</svg>'
	)

	return svg.svg()
}

module.exports = constructCentralImage
