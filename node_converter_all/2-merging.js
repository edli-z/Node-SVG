// returns a window with a document and an svg root node
const { createSVGWindow } = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')

 
function concatenateArrayOfSvgStr(svgStrArray){
	let r = ""
		svgStrArray.forEach(function({ svg }, index){
		const window = createSVGWindow()
		const document = window.document
		// register window and document
		registerWindow(window, document)
		// create canvas
		const merged_svg = SVG(document.documentElement)
		merged_svg.svg(svg)
		merged_svg.get(0).attr("id", "polygon_" + index)
		r += merged_svg.get(0).svg()
	})

	return r
}

function merge(svgStrArray){
	const concatenatedSvgStr = concatenateArrayOfSvgStr(svgStrArray) 

	const window = createSVGWindow()
	const document = window.document

	// register window and document
	registerWindow(window, document)
	 
	// create canvas
	const merged_svg = SVG(document.documentElement)
	 
	// use svg.js as normal
	merged_svg.svg(
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + 
			concatenatedSvgStr
		+ '</svg>'
	);

	let vbx_all = [];
	let max_x = 1;
	let max_y = 1;
	let scales = [];

	let polygons = '';

	for(i=0; i<merged_svg.get(0).children().length; i++) {
		let vbx = merged_svg.get(0).get(i).attr('viewBox');
		let vbx_data = vbx.split(" ");
		vbx_all[i] = [];
		vbx_all[i][0] = Number(vbx_data[2]);
		vbx_all[i][1] = Number(vbx_data[3]);
		if(vbx_all[i][0] > max_x) {
			max_x = Math.ceil(vbx_all[i][0]);
		}
		if(vbx_all[i][1] > max_y) {
			max_y = Math.ceil(vbx_all[i][1]);
		}
	}

	let sections = Math.ceil(Math.sqrt(merged_svg.get(0).children().length));
	let main_width = Math.ceil(sections * max_x);
	let main_height = Math.ceil(sections * max_y);

	let position_shift_x = 0;
	let position_shift_y = 0;

	for(i=0; i<merged_svg.get(0).children().length; i++) {
		if(Math.ceil(max_x / Math.ceil(vbx_all[i][0])) > Math.ceil(max_y / Math.ceil(vbx_all[i][1]))) {
			scales[i] = Math.ceil(max_x / Math.ceil(vbx_all[i][0])/1.5);
		} else {
			scales[i] = Math.ceil(max_y / Math.ceil(vbx_all[i][1])/1.5);
		}
		polygons += '<g transform="translate(' + position_shift_x * max_x + ' ' + position_shift_y * max_y + ')"><polygon id="' + merged_svg.get(0).get(i).attr('id') + '" transform="scale(' + scales[i] + ')" stroke-width="' + 1/scales[i] + '" points="' + merged_svg.get(0).get(i).get(0).attr('points') + '"/></g>';

		if (position_shift_x < (sections - 1)) {
			position_shift_x++;
		} else {
			position_shift_x = 0;
			position_shift_y++;
		}
	}

	let new_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${main_width}" height="${main_height}" viewBox="0 0 ${main_width} ${main_height}">${polygons}</svg>
	`

	return new_svg
}

module.exports = merge
