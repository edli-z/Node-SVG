// returns a window with a document and an svg root node
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')

function final_product(svgStr, polygonSvgStr, transformedPolygonSvgStr, before_style){

	const window = createSVGWindow()
	const document = window.document
	 
	// register window and document
	registerWindow(window, document)
	 
	// create canvas
	const shapes_sorted = SVG(document.documentElement)


	shapes_sorted.svg('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="936" height="504" viewBox="0 0 936 504">' + svgStr + polygonSvgStr + transformedPolygonSvgStr + '</svg>');

	let total_svgs = shapes_sorted.get(0).children().length;
	let total_shapes = shapes_sorted.get(0).children()[total_svgs - 1].children().length;
	let shapes_out = '';
	let path_blocks = [];

	for (let i=0; i<total_shapes; i++) {

		path_blocks[i] = '';

		for(let j=0; j<shapes_sorted.get(0).children()[i].children().length; j++){

			const path_block = SVG('<path/>')

			path_block.attr(
				'stroke-width', 
				parseFloat(document.getElementById("polygon_" + i).getAttribute("stroke-width"))
			)

			for (const [key, value] of Object.entries(before_style[i])) {
					path_block.attr(key, value)
			}

			path_block.attr(
				'd', shapes_sorted.get(0).children()[i].children()[j].attr("d")
			)

			path_blocks[i] += path_block.svg();

		}

		shapes_out += '<g transform="' + document.getElementById("transformed_polygon_" + i).getAttribute("transform") + '"><g transform="' + shapes_sorted.get(0).children()[total_svgs - 2].children()[i].attr("transform") + '"><g transform="' + shapes_sorted.get(0).children()[total_svgs - 2].children()[i].children()[0].attr("transform") + '">' + path_blocks[i] + '</g></g></g>'

	}

	let final_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" stroke="#000" width="${shapes_sorted.get(0).attr("width")}" height="${shapes_sorted.get(0).attr("height")}" viewBox="${shapes_sorted.get(0).attr("viewBox")}">${shapes_out}</svg>`

	return final_svg;

}

module.exports = final_product
