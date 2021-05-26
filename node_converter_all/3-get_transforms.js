// returns a window with a document and an svg root node
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')
 
function get_transforms(svgStr){

	const window = createSVGWindow()
	const document = window.document

	// register window and document
	registerWindow(window, document)

	 
	// create canvas
	const nested_svg = SVG(document.documentElement)
	 
	// use svg.js as normal
	nested_svg.svg(svgStr);

	let group_transforms = '';

	for(i=1; i<nested_svg.get(0).children().length; i++) {
		let trnsf = nested_svg.get(0).get(i).attr('transform');
		let shp_id = nested_svg.get(0).get(i).get(0).attr('id');
		group_transforms += '<g id="transformed_' + shp_id + '" transform="' + trnsf + '"></g>';
	}

	let svg_transformed = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${nested_svg.get(0).attr("width")}" height="${nested_svg.get(0).attr("height")}" viewBox="${nested_svg.get(0).attr("viewBox")}">${group_transforms}</svg>
	`

	return svg_transformed
}

module.exports = get_transforms
