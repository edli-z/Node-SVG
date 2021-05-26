const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow, find, Circle } = require('@svgdotjs/svg.js')

//const fs = require("fs")

function replaceImgWithCircle(svgStr){

	const window = createSVGWindow()
	const document = window.document
	 
	// register window and document
	registerWindow(window, document)
	 
	// create canvas
	const canvas = SVG(svgStr)


	canvas.find('image').forEach(function(image){

		var r = image.attr("clip-path")

		if(!r){
			return
		}

		r = r.match(/url\(#(\w+)\)/)

		if(Array.isArray(r)){

			const clipPathId = r[1]	
			const clipCircle = canvas.findOne("clipPath#"+clipPathId+">circle")
			const clipR = clipCircle.attr("r")
			const clipCx = clipCircle.attr("cx")
			const clipCy = clipCircle.attr("cy")

			const imageWidth = image.attr('width')
			const imageHeight = image.attr('height')
			const imageX = image.attr('x')
			const imageY = image.attr('y')
			const imageTransform = image.attr('transform')

			const circleR = imageWidth * clipR
			const circleCx = imageX + (imageWidth * clipCx)
			const circleCy = imageY + (imageHeight * clipCx)

			const circle = new Circle()

			circle.attr("r", circleR)
			circle.attr("cx", circleCx)
			circle.attr("cy", circleCy)
			circle.attr("transform", imageTransform)

			circle.attr("stroke", "red")
			circle.attr("stroke-width", 0.01)
			circle.attr("fill", "none")

			circle.addTo(canvas)

			image.remove()

		}
	})

	return canvas.svg()

}


/*
const svgStr = fs.readFileSync(
	"node_converter_all/signatures/701/1619969168583.svg", 
	{ encoding: 'utf8' }
)

console.log(replaceImgWithCircle(svgStr))
*/

module.exports = replaceImgWithCircle
